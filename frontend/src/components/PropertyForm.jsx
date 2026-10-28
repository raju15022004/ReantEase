import { useState } from 'react'
import ErrorMessage from './ErrorMessage'

export default function PropertyForm({ initial, onSubmit, submitLabel }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    const value = (key) => form.get(key)?.toString().trim() || ''
    const urls = value('imageUrls').split(/[\n,]+/).map((url) => url.trim()).filter(Boolean)
    const badUrl = urls.some((url) => {
      try { return !['https:', 'http:'].includes(new URL(url).protocol) } catch { return true }
    })
    if (badUrl) { setBusy(false); setError('Please enter valid http or https image URLs.'); return }
    try {
      await onSubmit({
        title: value('title'), description: value('description'), propertyType: value('propertyType'),
        monthlyRent: Number(value('monthlyRent')), securityDeposit: Number(value('securityDeposit')),
        city: value('city'), locality: value('locality'), fullAddress: value('fullAddress'),
        latitude: value('latitude') ? Number(value('latitude')) : null,
        longitude: value('longitude') ? Number(value('longitude')) : null,
        occupancyType: value('occupancyType'), availableRooms: Number(value('availableRooms')),
        availableFrom: value('availableFrom'), houseRules: value('houseRules'),
        imageUrls: urls, amenities: value('amenities').split(',').map((a) => a.trim()).filter(Boolean),
      })
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-card md:p-9">
    <ErrorMessage message={error} />
    <div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold md:col-span-2">Listing title<input name="title" required maxLength="180" defaultValue={initial?.title} className="field mt-2" /></label>
      <label className="text-sm font-semibold">Property type<select name="propertyType" defaultValue={initial?.propertyType || 'PG'} className="field mt-2"><option>PG</option><option>ROOM</option><option>FLAT</option><option>HOSTEL</option></select></label>
      <label className="text-sm font-semibold">Occupancy preference<input name="occupancyType" maxLength="40" defaultValue={initial?.occupancyType} placeholder="Single, double, shared" className="field mt-2" /></label>
      <label className="text-sm font-semibold">Monthly rent (₹)<input name="monthlyRent" type="number" min="0" step="0.01" required defaultValue={initial?.monthlyRent} className="field mt-2" /></label>
      <label className="text-sm font-semibold">Security deposit (₹)<input name="securityDeposit" type="number" min="0" step="0.01" required defaultValue={initial?.securityDeposit ?? 0} className="field mt-2" /></label>
      <label className="text-sm font-semibold">City<input name="city" required maxLength="100" defaultValue={initial?.city} className="field mt-2" /></label>
      <label className="text-sm font-semibold">Locality<input name="locality" required maxLength="120" defaultValue={initial?.locality} className="field mt-2" /></label>
      <label className="text-sm font-semibold md:col-span-2">Address<input name="fullAddress" required maxLength="500" defaultValue={initial?.fullAddress} className="field mt-2" /></label>
      <label className="text-sm font-semibold md:col-span-2">Description<textarea name="description" required maxLength="5000" rows="5" defaultValue={initial?.description} className="field mt-2" /></label>
      <label className="text-sm font-semibold">Rooms available<input name="availableRooms" type="number" min="0" max="100" required defaultValue={initial?.availableRooms ?? 1} className="field mt-2" /></label>
      <label className="text-sm font-semibold">Available from<input name="availableFrom" type="date" required defaultValue={initial?.availableFrom || new Date().toISOString().slice(0, 10)} className="field mt-2" /></label>
      <label className="text-sm font-semibold">Latitude (optional)<input name="latitude" type="number" min="-90" max="90" step="any" defaultValue={initial?.latitude} className="field mt-2" /></label>
      <label className="text-sm font-semibold">Longitude (optional)<input name="longitude" type="number" min="-180" max="180" step="any" defaultValue={initial?.longitude} className="field mt-2" /></label>
      <label className="text-sm font-semibold md:col-span-2">Amenities <span className="font-normal text-ink/50">(comma separated)</span><input name="amenities" maxLength="500" defaultValue={initial?.amenities?.join(', ')} placeholder="Wi-Fi, AC, Meals, Parking" className="field mt-2" /></label>
      <label className="text-sm font-semibold md:col-span-2">Image URLs <span className="font-normal text-ink/50">(one per line; HTTPS preferred)</span><textarea name="imageUrls" rows="3" defaultValue={initial?.imageUrls?.join('\n')} placeholder="https://example.com/room.jpg" className="field mt-2" /></label>
      <label className="text-sm font-semibold md:col-span-2">House rules<textarea name="houseRules" rows="3" maxLength="2000" defaultValue={initial?.houseRules} placeholder="Share expectations with potential residents." className="field mt-2" /></label>
    </div>
    <p className="mt-5 text-xs leading-5 text-ink/50">New listings and changes are sent for admin review. Only share a genuine address and valid map coordinates; listing content is not independently verified by RentEase.</p>
    <button disabled={busy} className="mt-6 rounded-full bg-ink px-7 py-3 font-bold text-white disabled:opacity-50">{busy ? 'Saving…' : submitLabel}</button>
  </form>
}

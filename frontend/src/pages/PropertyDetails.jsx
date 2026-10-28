import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { propertyService } from '../services/propertyService'
import { favoriteService } from '../services/favoriteService'
import PropertyGallery from '../components/PropertyGallery'
import PropertyMap from '../components/PropertyMap'
import BookingForm from '../components/BookingForm'
import PropertyCard from '../components/PropertyCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { formatCurrency, humanize } from '../utils/format'

export default function PropertyDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [property, setProperty] = useState(null)
  const [similar, setSimilar] = useState([])
  const [favorite, setFavorite] = useState(false)
  const [message, setMessage] = useState('')
  const [showReport, setShowReport] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    propertyService.get(id).then((data) => {
      setProperty(data)
      propertyService.search({ location: data.city, size: 4, page: 0, sort: 'newest' })
        .then((result) => setSimilar(result.content.filter((item) => item.id !== data.id).slice(0, 3)))
        .catch((e) => setMessage(`Similar homes could not be loaded: ${e.message}`))
    }).catch((e) => setError(e.message))
  }, [id])
  useEffect(() => {
    if (user?.role === 'STUDENT') {
      favoriteService.list().then((items) => setFavorite(items.some((item) => String(item.id) === String(id))))
        .catch((e) => setMessage(e.message))
    } else {
      setFavorite(false)
    }
  }, [id, user?.role])
  async function toggleFavorite() {
    try {
      if (favorite) await favoriteService.remove(property.id); else await favoriteService.add(property.id)
      setFavorite(!favorite)
    } catch (e) { setMessage(e.message) }
  }
  async function report(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await propertyService.report(property.id, { reason: form.get('reason'), details: form.get('details') })
      setMessage('Thank you. Your report has been sent for review.')
      setShowReport(false)
    } catch (e) { setMessage(e.message) }
  }
  if (error) return <div className="mx-auto max-w-5xl px-5 py-12"><ErrorMessage message={error} /></div>
  if (!property) return <LoadingSpinner label="Loading property…" />
  return <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
    <Link to="/properties" className="text-sm font-semibold text-ink/60">← Back to homes</Link>
    <div className="mt-5 grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
      <div><PropertyGallery property={property} />
        <div className="mt-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">{humanize(property.propertyType)} · {property.occupancyType || 'Flexible occupancy'}</p><h1 className="mt-2 font-display text-4xl">{property.title}</h1><p className="mt-2 text-ink/60">{property.locality}, {property.city}</p></div>
          {user?.role === 'STUDENT' && <button onClick={toggleFavorite} className="rounded-full border px-4 py-2 font-semibold">{favorite ? '♥ Saved' : '♡ Save home'}</button>}</div>
          {message && <p role="status" className="mt-3 text-sm text-orange">{message}</p>}
          {user?.role === 'STUDENT' && <div className="mt-4"><button onClick={() => setShowReport((open) => !open)} className="text-sm font-semibold text-ink/55 underline">Report this listing</button>
            {showReport && <form onSubmit={report} className="mt-3 rounded-2xl bg-white p-4">
              <label className="block text-sm font-semibold">Reason<select required name="reason" className="field mt-2"><option value="INACCURATE_INFORMATION">Inaccurate information</option><option value="SUSPICIOUS_LISTING">Suspicious listing</option><option value="UNAVAILABLE_PROPERTY">Unavailable property</option><option value="OTHER">Other</option></select></label>
              <label className="mt-3 block text-sm font-semibold">Details<textarea name="details" maxLength="1500" rows="3" className="field mt-2" /></label>
              <button className="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">Send report</button>
            </form>}
          </div>}
          <p className="mt-6 whitespace-pre-line leading-7 text-ink/70">{property.description}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[['Available rooms', property.availableRooms], ['Available from', property.availableFrom], ['Monthly rent', formatCurrency(property.monthlyRent)]].map(([label, value]) =>
            <div key={label} className="rounded-2xl bg-white p-5"><p className="text-xs uppercase tracking-widest text-ink/45">{label}</p><p className="mt-2 font-semibold">{value}</p></div>)}
        </div>
        <div className="mt-8"><h2 className="font-display text-2xl">Amenities</h2><div className="mt-4 flex flex-wrap gap-2">{property.amenities?.length ? property.amenities.map((a) => <span key={a} className="rounded-full bg-white px-4 py-2 text-sm">{a}</span>) : <p className="text-sm text-ink/60">No amenities listed.</p>}</div></div>
        <div className="mt-8"><h2 className="font-display text-2xl">House rules</h2><p className="mt-3 whitespace-pre-line leading-7 text-ink/65">{property.houseRules || 'Please contact the owner to discuss house rules.'}</p></div>
        <div className="mt-8"><h2 className="mb-4 font-display text-2xl">Location</h2><p className="mb-4 text-sm text-ink/60">{property.fullAddress}</p><PropertyMap latitude={property.latitude} longitude={property.longitude} /></div>
        <div className="mt-8 rounded-3xl bg-white p-6"><h2 className="font-display text-2xl">Hosted by {property.owner?.name}</h2><p className="mt-2 text-sm text-ink/60">Owner contact details are shared only through the booking request process.</p></div>
      </div>
      <aside className="space-y-5">
        <div className="rounded-3xl bg-ink p-6 text-white"><p className="text-xs uppercase tracking-widest text-white/55">Monthly rent</p><p className="mt-2 font-display text-4xl">{formatCurrency(property.monthlyRent)}</p><p className="mt-3 text-sm text-white/65">Security deposit: {formatCurrency(property.securityDeposit)}</p></div>
        {user?.role === 'STUDENT' ? <BookingForm propertyId={property.id} availableFrom={property.availableFrom} onComplete={() => setMessage('Request sent. Check your bookings dashboard for updates.')} /> :
          <div className="rounded-3xl bg-white p-6"><h3 className="font-display text-xl">Interested in this home?</h3><p className="mt-2 text-sm leading-6 text-ink/60">Sign in as a student to send a booking request.</p><Link to="/login" className="mt-4 inline-block rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">Log in to request</Link></div>}
      </aside>
    </div>
    {similar.length > 0 && <section className="mt-16"><h2 className="section-title">More around {property.city}</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{similar.map((item) => <PropertyCard key={item.id} property={item} />)}</div></section>}
  </div>
}

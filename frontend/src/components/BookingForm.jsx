import { useState } from 'react'
import { bookingService } from '../services/bookingService'
import ErrorMessage from './ErrorMessage'

export default function BookingForm({ propertyId, availableFrom, onComplete }) {
  const [moveInDate, setMoveInDate] = useState(availableFrom || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault()
    setBusy(true); setError('')
    try { await bookingService.create(propertyId, { moveInDate, message }); onComplete() }
    catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-card">
    <h3 className="font-display text-2xl">Request a visit</h3>
    <p className="mt-1 text-sm text-ink/60">This is a request only. No payment is collected.</p>
    <ErrorMessage message={error} />
    <label className="mt-4 block text-sm font-semibold">Move-in date<input type="date" required min={availableFrom} value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} className="field mt-2" /></label>
    <label className="mt-4 block text-sm font-semibold">Message<textarea rows="3" maxLength="2000" value={message} onChange={(e) => setMessage(e.target.value)} className="field mt-2" placeholder="Tell the owner a little about your plans." /></label>
    <button disabled={busy} className="mt-5 w-full rounded-full bg-ink px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Sending…' : 'Send request'}</button>
  </form>
}

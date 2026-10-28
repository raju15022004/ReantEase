import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookingService } from '../services/bookingService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import BookingStatusBadge from '../components/BookingStatusBadge'

export default function MyBookings() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  async function load() { try { setItems((await bookingService.studentList()).content) } catch (e) { setError(e.message) } }
  useEffect(load, [])
  async function cancel(id) {
    try { await bookingService.cancel(id); await load() } catch (e) { setError(e.message) }
  }
  return <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8"><p className="eyebrow">Your requests</p><h1 className="section-title">My bookings</h1>
    <ErrorMessage message={error} onRetry={load} />
    {!items ? <LoadingSpinner /> : items.length ? <div className="mt-8 grid gap-4">{items.map((booking) =>
      <article key={booking.id} className="flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-white p-6 shadow-card">
        <div><p className="text-sm text-ink/50">Request #{booking.id} · {booking.moveInDate}</p><h2 className="mt-1 font-display text-2xl">{booking.propertyTitle}</h2><p className="mt-1 text-sm text-ink/60">{booking.locality}, {booking.city}</p>{booking.message && <p className="mt-3 max-w-xl text-sm">{booking.message}</p>}</div>
        <div className="flex items-center gap-3"><BookingStatusBadge status={booking.status} />{booking.status === 'PENDING' && <button onClick={() => cancel(booking.id)} className="rounded-full border px-4 py-2 text-sm">Cancel</button>}
          <Link to={`/properties/${booking.propertyId}`} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">Details</Link></div>
      </article>)}</div> : <div className="mt-8"><EmptyState title="No booking requests yet" message="When you find a place you like, send a request to the owner." /></div>}
  </section>
}

import { useEffect, useState } from 'react'
import DashboardSidebar from '../components/DashboardSidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import BookingStatusBadge from '../components/BookingStatusBadge'
import { bookingService } from '../services/bookingService'

export default function OwnerBookings() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  async function load() { try { setItems((await bookingService.ownerList()).content) } catch (e) { setError(e.message) } }
  useEffect(load, [])
  async function update(id, status) { try { await bookingService.setStatus(id, status); await load() } catch (e) { setError(e.message) } }
  return <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-8">
    <DashboardSidebar /><section><p className="eyebrow">Owner workspace</p><h1 className="section-title">Booking requests</h1><ErrorMessage message={error} onRetry={load} />
      {!items ? <LoadingSpinner /> : items.length ? <div className="mt-7 grid gap-4">{items.map((b) => <article key={b.id} className="rounded-3xl bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-ink/50">Move-in {b.moveInDate} · {b.locality}, {b.city}</p><h2 className="mt-1 font-display text-2xl">{b.propertyTitle}</h2><p className="mt-2 text-sm"><strong>{b.studentName}</strong> · {b.studentEmail}</p></div><BookingStatusBadge status={b.status} /></div>
        {b.message && <p className="mt-4 rounded-xl bg-cream p-4 text-sm leading-6">{b.message}</p>}
        {b.status === 'PENDING' && <div className="mt-4 flex gap-3"><button onClick={() => update(b.id, 'ACCEPTED')} className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white">Accept request</button><button onClick={() => update(b.id, 'REJECTED')} className="rounded-full border px-5 py-2.5 text-sm font-bold">Decline</button></div>}
      </article>)}</div> : <div className="mt-7"><EmptyState title="No requests yet" /></div>}
    </section>
  </div>
}

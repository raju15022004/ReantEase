import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { propertyService } from '../services/propertyService'
import { bookingService } from '../services/bookingService'
import BookingStatusBadge from '../components/BookingStatusBadge'

export default function OwnerDashboard() {
  const [properties, setProperties] = useState(null)
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([propertyService.mine(), bookingService.ownerList()])
      .then(([homes, requests]) => { setProperties(homes); setBookings(requests) })
      .catch((e) => setError(e.message))
  }, [])
  return <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-8">
    <DashboardSidebar /><div><p className="eyebrow">Owner workspace</p><h1 className="section-title">Your home base</h1><ErrorMessage message={error} />
      {!properties || !bookings ? <LoadingSpinner /> : <>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">{[['Listings', properties.totalElements], ['Requests', bookings.totalElements], ['Pending requests', bookings.content.filter((b) => b.status === 'PENDING').length]].map(([label, number]) =>
          <div key={label} className="rounded-3xl bg-white p-6 shadow-card"><p className="text-sm text-ink/55">{label}</p><p className="mt-2 font-display text-4xl">{number}</p></div>)}</div>
        <div className="mt-8 flex items-center justify-between"><h2 className="font-display text-2xl">Recent requests</h2><Link to="/owner/bookings" className="text-sm font-bold">View all →</Link></div>
        {!bookings.content.length ? <p className="mt-4 rounded-2xl bg-white p-6 text-sm text-ink/60">No requests yet. Keep your listing availability up to date.</p> : <div className="mt-4 grid gap-3">{bookings.content.slice(0, 5).map((b) =>
          <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5"><div><p className="font-semibold">{b.studentName} · {b.propertyTitle}</p><p className="mt-1 text-sm text-ink/60">Move-in {b.moveInDate}</p></div><BookingStatusBadge status={b.status} /></div>)}</div>}
      </>}
    </div>
  </div>
}

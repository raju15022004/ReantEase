import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { adminService } from '../services/adminService'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  function load() { adminService.dashboard().then(setStats).catch((e) => setError(e.message)) }
  useEffect(load, [])
  return <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-8"><DashboardSidebar />
    <section><p className="eyebrow">Platform administration</p><h1 className="section-title">RentEase overview</h1><ErrorMessage message={error} onRetry={load} />
      {!stats ? <LoadingSpinner /> : <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[['Users', stats.users, '/admin/users'], ['Properties', stats.properties, '/admin/properties'], ['Awaiting review', stats.pendingProperties, '/admin/properties?status=PENDING'], ['Pending requests', stats.pendingBookings, '/admin/bookings'], ['Accepted requests', stats.acceptedBookings, '/admin/bookings']].map(([label, number, url]) =>
        <Link to={url} key={label} className="rounded-3xl bg-white p-6 shadow-card transition hover:-translate-y-1"><p className="text-sm text-ink/55">{label}</p><p className="mt-2 font-display text-4xl">{number}</p><p className="mt-3 text-sm font-bold text-orange">Manage →</p></Link>)}</div>}
      <Link to="/admin/reports" className="mt-7 inline-block rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">Review reported listings</Link>
    </section>
  </div>
}

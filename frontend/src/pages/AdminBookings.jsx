import { useEffect, useState } from 'react'
import { bookingService } from '../services/bookingService'
import DashboardSidebar from '../components/DashboardSidebar'
import BookingStatusBadge from '../components/BookingStatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function AdminBookings() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { bookingService.adminList().then((data) => setItems(data.content)).catch((e) => setError(e.message)) }, [])
  return <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-8"><DashboardSidebar /><section>
    <p className="eyebrow">Platform administration</p><h1 className="section-title">Booking records</h1><ErrorMessage message={error} />
    {!items ? <LoadingSpinner /> : <div className="mt-7 overflow-x-auto rounded-3xl bg-white shadow-card"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-cream text-xs uppercase text-ink/50"><tr><th className="p-4">Property</th><th className="p-4">Student</th><th className="p-4">Move-in</th><th className="p-4">Status</th></tr></thead><tbody>{items.map((b) =>
      <tr key={b.id} className="border-t border-ink/5"><td className="p-4 font-semibold">{b.propertyTitle}<span className="block text-xs font-normal text-ink/50">{b.city}</span></td><td className="p-4">{b.studentName}<span className="block text-xs text-ink/50">{b.studentEmail}</span></td><td className="p-4">{b.moveInDate}</td><td className="p-4"><BookingStatusBadge status={b.status} /></td></tr>)}</tbody></table>{!items.length && <p className="p-6 text-center text-ink/60">No booking records yet.</p>}</div>}
  </section></div>
}

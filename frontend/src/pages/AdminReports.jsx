import { useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import DashboardSidebar from '../components/DashboardSidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function AdminReports() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  async function load() { try { setItems((await adminService.reports()).content) } catch (e) { setError(e.message) } }
  useEffect(load, [])
  async function update(id, status) { try { await adminService.updateReport(id, status); await load() } catch (e) { setError(e.message) } }
  return <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-8"><DashboardSidebar /><section>
    <p className="eyebrow">Platform administration</p><h1 className="section-title">Reported listings</h1><ErrorMessage message={error} onRetry={load} />
    {!items ? <LoadingSpinner /> : items.length ? <div className="mt-7 grid gap-4">{items.map((report) => <article key={report.id} className="rounded-3xl bg-white p-6 shadow-card">
      <div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-orange">{report.status} · Report #{report.id}</p><h2 className="mt-1 font-display text-2xl">{report.propertyTitle}</h2></div><span className="text-sm text-ink/55">Property #{report.propertyId}</span></div>
      <p className="mt-4 font-semibold">{report.reason}</p>{report.details && <p className="mt-2 text-sm leading-6 text-ink/65">{report.details}</p>}
      <div className="mt-4 flex gap-3"><button onClick={() => update(report.id, 'REVIEWED')} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">Mark reviewed</button><button onClick={() => update(report.id, 'DISMISSED')} className="rounded-full border px-4 py-2 text-sm font-semibold">Dismiss</button></div>
    </article>)}</div> : <p className="mt-7 rounded-2xl bg-white p-6 text-ink/60">There are no reports to review.</p>}
  </section></div>
}

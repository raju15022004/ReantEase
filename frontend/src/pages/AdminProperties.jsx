import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { propertyService } from '../services/propertyService'
import { humanize } from '../utils/format'

export default function AdminProperties() {
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  async function load() { try { setData(await propertyService.adminList({ status: params.get('status') || '', page: 0, size: 50 })) } catch (e) { setError(e.message) } }
  useEffect(() => { load() }, [params])
  async function decide(id, status) { try { await propertyService.approve(id, status); await load() } catch (e) { setError(e.message) } }
  return <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-8"><DashboardSidebar /><section>
    <p className="eyebrow">Platform administration</p><h1 className="section-title">Property moderation</h1><label className="mt-4 inline-flex items-center gap-3 text-sm font-semibold">Approval status<select value={params.get('status') || ''} onChange={(e) => setParams(e.target.value ? { status: e.target.value } : {})} className="field w-auto"><option value="">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></label>
    <ErrorMessage message={error} onRetry={load} />{!data ? <LoadingSpinner /> : <div className="mt-6 grid gap-4">{data.content.map((p) => <article key={p.id} className="rounded-3xl bg-white p-6 shadow-card"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-orange">{humanize(p.approvalStatus)} · {p.active ? 'Active' : 'Inactive'}</p><h2 className="mt-1 font-display text-2xl">{p.title}</h2><p className="mt-1 text-sm text-ink/60">{p.locality}, {p.city} · {p.owner?.name}</p></div><p className="text-sm text-ink/60">{p.propertyType} · ₹{p.monthlyRent}/mo</p></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-ink/65">{p.description}</p>
      {p.approvalStatus !== 'APPROVED' && <div className="mt-4 flex gap-3"><button onClick={() => decide(p.id, 'APPROVED')} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">Approve</button><button onClick={() => decide(p.id, 'REJECTED')} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">Reject</button></div>}
    </article>)}{!data.content.length && <p className="rounded-2xl bg-white p-6 text-ink/60">No listings found for this filter.</p>}</div>}</section></div>
}

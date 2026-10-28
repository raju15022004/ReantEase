import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { propertyService } from '../services/propertyService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import { formatCurrency, humanize, propertyImage } from '../utils/format'

export default function OwnerProperties() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const location = useLocation()
  async function load() { try { setData(await propertyService.mine()) } catch (e) { setError(e.message) } }
  useEffect(load, [])
  async function remove(id) {
    if (!window.confirm('Deactivate this listing? It will no longer appear in search.')) return
    try { await propertyService.remove(id); await load() } catch (e) { setError(e.message) }
  }
  return <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Owner workspace</p><h1 className="section-title">My listings</h1></div><Link to="/owner/properties/new" className="rounded-full bg-ink px-5 py-3 font-bold text-white">+ Add property</Link></div>
    {location.state?.notice && <p role="status" className="mt-4 rounded-xl bg-green-100 p-4 text-sm text-green-900">{location.state.notice}</p>}
    <ErrorMessage message={error} onRetry={load} />
    {!data ? <LoadingSpinner /> : !data.content.length ? <div className="mt-8"><EmptyState title="Your first listing starts here" message="Share your property with students and young professionals." /></div> :
      <div className="mt-8 grid gap-4">{data.content.map((p) => <article key={p.id} className="flex flex-wrap items-center gap-5 rounded-3xl bg-white p-4 shadow-card">
        <img src={propertyImage(p)} alt="" className="h-28 w-36 rounded-2xl object-cover" /><div className="min-w-[180px] flex-1"><p className="text-xs font-bold uppercase tracking-wide text-orange">{humanize(p.approvalStatus)}{p.active ? '' : ' · Inactive'}</p><h2 className="mt-1 font-display text-xl">{p.title}</h2><p className="mt-1 text-sm text-ink/60">{p.locality}, {p.city} · {formatCurrency(p.monthlyRent)}/mo</p></div>
        <div className="flex gap-2"><Link to={`/owner/properties/${p.id}/edit`} className="rounded-full border px-4 py-2 text-sm font-semibold">Edit</Link><button onClick={() => remove(p.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-700">Deactivate</button></div>
      </article>)}</div>}
  </section>
}

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function SearchBar({ compact = false }) {
  const [params] = useSearchParams()
  const [location, setLocation] = useState(params.get('location') || '')
  const [minRent, setMinRent] = useState(params.get('minRent') || '')
  const [maxRent, setMaxRent] = useState(params.get('maxRent') || '')
  const [type, setType] = useState(params.get('type') || '')
  const navigate = useNavigate()

  function submit(event) {
    event.preventDefault()
    const query = new URLSearchParams()
    Object.entries({ location, minRent, maxRent, type }).forEach(([key, value]) => value && query.set(key, value))
    navigate(`/properties?${query.toString()}`)
  }

  return <form onSubmit={submit} className={`grid gap-3 rounded-3xl bg-white p-3 shadow-card ${compact ? 'md:grid-cols-[2fr_1fr_1fr_1fr_auto]' : 'md:grid-cols-[2fr_1fr_1fr_1fr_auto]'}`}>
    <label className="min-w-0 px-3 py-2"><span className="block text-xs font-semibold uppercase tracking-wider text-ink/45">City or locality</span>
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Pune, Koramangala" className="mt-1 w-full bg-transparent text-sm outline-none" /></label>
    <label className="px-3 py-2"><span className="block text-xs font-semibold uppercase tracking-wider text-ink/45">Min rent</span>
      <input type="number" min="0" value={minRent} onChange={(e) => setMinRent(e.target.value)} placeholder="₹ 5,000" className="mt-1 w-full bg-transparent text-sm outline-none" /></label>
    <label className="px-3 py-2"><span className="block text-xs font-semibold uppercase tracking-wider text-ink/45">Max rent</span>
      <input type="number" min="0" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} placeholder="₹ 25,000" className="mt-1 w-full bg-transparent text-sm outline-none" /></label>
    <label className="px-3 py-2"><span className="block text-xs font-semibold uppercase tracking-wider text-ink/45">Home type</span>
      <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full bg-transparent text-sm outline-none">
        <option value="">Any type</option><option value="PG">PG</option><option value="ROOM">Room</option><option value="FLAT">Flat</option><option value="HOSTEL">Hostel</option>
      </select></label>
    <button className="rounded-2xl bg-ink px-7 py-3 font-semibold text-white transition hover:bg-ink/90">Search</button>
  </form>
}

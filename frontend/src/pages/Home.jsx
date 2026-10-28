import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { propertyService } from '../services/propertyService'

const cities = [['Bengaluru', '01'], ['Pune', '02'], ['Hyderabad', '03'], ['Delhi NCR', '04']]

export default function Home() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  function load() {
    setLoading(true); setError('')
    propertyService.featured().then(setProperties).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [])
  return <div>
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 lg:px-8 lg:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div><p className="mb-5 inline-flex rounded-full bg-leaf/40 px-4 py-2 text-xs font-bold uppercase tracking-[.15em]">A better way to find your place</p>
          <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">Find Your Perfect <span className="text-orange">Room, PG or Flat</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink/65">Affordable, comfortable stays near the colleges and workplaces that make your city feel close.</p>
          <div className="mt-8 flex items-center gap-4 text-sm"><Link to="/properties" className="rounded-full bg-ink px-6 py-3 font-semibold text-white">Explore homes</Link><span className="text-ink/55">Simple search · Direct requests</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Bright furnished apartment interior" className="h-[400px] w-full rounded-[2rem] object-cover shadow-card sm:h-[500px]" />
          <div className="absolute -bottom-6 left-4 rounded-2xl bg-white p-4 shadow-card sm:-left-6"><span className="block text-xs text-ink/55">Your next chapter</span><strong className="font-display text-lg">starts at home.</strong></div>
          <div className="absolute right-4 top-5 rounded-2xl bg-leaf px-4 py-3 text-sm font-semibold">Find a place<br />that fits you</div>
        </div>
      </div>
      <div className="relative z-10 mt-14"><SearchBar /></div>
    </section>
    <section className="bg-white py-16"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Handpicked for you</p><h2 className="section-title">Featured homes</h2></div><Link to="/properties" className="font-semibold text-orange">View all homes →</Link></div>
      {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} onRetry={load} /> : properties.length ?
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{properties.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} />)}</div> :
        <p className="mt-8 rounded-2xl bg-cream p-6 text-ink/65">No approved homes are featured yet. Owners can add a listing after they register.</p>}
    </div></section>
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Popular places</p><h2 className="section-title">Where are you headed?</h2></div><Link to="/properties" className="font-semibold">Explore every city →</Link></div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">{cities.map(([city, index]) => <Link key={city} to={`/properties?location=${encodeURIComponent(city)}`} className="group relative overflow-hidden rounded-3xl bg-leaf/30 p-6 transition hover:bg-leaf/60">
        <span className="text-sm text-ink/50">0{index}</span><h3 className="mt-12 font-display text-2xl">{city}</h3><span className="mt-2 inline-block text-sm text-ink/60">Find your stay →</span></Link>)}</div>
    </section>
    <section className="bg-[#e9efe8] py-16"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <p className="eyebrow">A little more peace of mind</p><h2 className="section-title">Home hunting, made human.</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{[['01', 'Search with clarity', 'Filter by location, budget, home type and the things that matter to you.'], ['02', 'Explore the details', 'See amenities, availability, house rules and location information up front.'], ['03', 'Request directly', 'Send a move-in request to the owner. No payments or confirmations happen automatically.']].map(([n, title, text]) =>
        <article key={n} className="rounded-3xl bg-white p-7"><span className="font-display text-3xl text-orange">{n}</span><h3 className="mt-6 font-display text-2xl">{title}</h3><p className="mt-3 leading-7 text-ink/60">{text}</p></article>)}</div>
    </div></section>
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><div className="rounded-[2rem] bg-ink p-8 text-white md:flex md:items-center md:justify-between md:p-12">
      <div><p className="text-sm font-bold uppercase tracking-widest text-leaf">Your search starts here</p><h2 className="mt-3 font-display text-3xl md:text-4xl">Ready to find a place of your own?</h2></div>
      <Link to="/properties" className="mt-6 inline-block rounded-full bg-leaf px-6 py-3 font-bold text-ink md:mt-0">Browse homes</Link>
    </div></section>
  </div>
}

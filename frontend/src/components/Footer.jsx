import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer className="mt-20 bg-ink text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 lg:px-8">
      <div><Link to="/" className="font-display text-2xl font-bold">rentease<span className="text-orange">.</span></Link><p className="mt-3 max-w-sm text-sm leading-6 text-white/60">A simpler way to find a place that feels like yours, close to campus and the city.</p></div>
      <div><h3 className="font-semibold">Explore</h3><div className="mt-4 grid gap-2 text-sm text-white/65"><Link to="/properties">Browse homes</Link><Link to="/about">About RentEase</Link><Link to="/contact">Contact</Link></div></div>
      <div><h3 className="font-semibold">For property owners</h3><p className="mt-4 text-sm leading-6 text-white/65">Share your space with students and young professionals in a few simple steps.</p><Link to="/register?role=OWNER" className="mt-4 inline-block text-sm font-bold text-leaf">List a property →</Link></div>
    </div>
    <div className="border-t border-white/10 py-5 text-center text-xs text-white/45">© {new Date().getFullYear()} RentEase. Sample listings are demonstrations, not verified offers.</div>
  </footer>
}

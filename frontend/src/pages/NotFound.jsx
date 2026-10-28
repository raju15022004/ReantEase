import { Link } from 'react-router-dom'

export default function NotFound() {
  return <section className="mx-auto max-w-3xl px-5 py-24 text-center"><p className="eyebrow">404 · Not found</p><h1 className="mt-2 font-display text-5xl">This page moved out.</h1><p className="mt-4 text-ink/60">The address may be incorrect, or the page is no longer available.</p><Link to="/" className="mt-7 inline-block rounded-full bg-ink px-6 py-3 font-bold text-white">Back to RentEase</Link></section>
}

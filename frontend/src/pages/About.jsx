import { Link } from 'react-router-dom'

export default function About() {
  return <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8"><p className="eyebrow">About RentEase</p><h1 className="max-w-3xl font-display text-5xl leading-tight">A more thoughtful way to find your next home.</h1>
    <p className="mt-7 max-w-3xl text-lg leading-8 text-ink/65">RentEase helps students and young professionals discover rooms, PGs, hostels and flats near the places they study and work. Search by budget and locality, compare the details that matter, and request a conversation with the property owner.</p>
    <div className="mt-12 grid gap-5 md:grid-cols-3">{[['Clear details', 'Rent, deposit, rooms and amenities shown together.'], ['Your choice', 'Search and compare listings at your own pace.'], ['Safer decisions', 'Listings are reviewed by admins, but details should still be independently confirmed.']].map(([title, text]) =>
      <article key={title} className="rounded-3xl bg-white p-7 shadow-card"><h2 className="font-display text-2xl">{title}</h2><p className="mt-3 text-sm leading-6 text-ink/60">{text}</p></article>)}</div>
    <p className="mt-10 rounded-2xl bg-leaf/40 p-5 text-sm leading-6 text-ink/70">RentEase does not independently verify the truth of every owner-submitted statement. A booking request is not a confirmed reservation, contract or payment transaction.</p>
    <Link to="/properties" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-bold text-white">Find a home</Link>
  </section>
}

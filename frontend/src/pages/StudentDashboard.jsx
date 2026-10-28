import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DashboardSidebar from '../components/DashboardSidebar'

export default function StudentDashboard() {
  const { user } = useAuth()
  return <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-8"><DashboardSidebar />
    <section><p className="eyebrow">Student workspace</p><h1 className="section-title">Welcome, {user?.name?.split(' ')[0]}.</h1>
      <p className="mt-3 text-ink/60">Your next place is closer than you think. Pick up where you left off.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{[['Browse homes', 'Discover rooms, PGs and flats by location and budget.', '/properties', 'Start exploring →'], ['My bookings', 'Keep an eye on your booking request status.', '/student/bookings', 'View requests →'], ['Saved homes', 'Return to the places you want to remember.', '/student/favorites', 'See shortlist →']].map(([title, text, url, link]) =>
        <article key={title} className="rounded-3xl bg-white p-6 shadow-card"><h2 className="font-display text-2xl">{title}</h2><p className="mt-3 min-h-14 text-sm leading-6 text-ink/60">{text}</p><Link to={url} className="mt-5 inline-block font-bold text-orange">{link}</Link></article>)}</div>
      <div className="mt-8 rounded-3xl bg-leaf/40 p-7"><h2 className="font-display text-2xl">A quick reminder</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">A booking request is not a confirmed reservation or a legal agreement. Confirm details and availability with the property owner before making plans.</p></div>
    </section>
  </div>
}

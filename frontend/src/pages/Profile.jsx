import { useAuth } from '../context/AuthContext'
import DashboardSidebar from '../components/DashboardSidebar'

export default function Profile() {
  const { user } = useAuth()
  return <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-8"><DashboardSidebar />
    <section><p className="eyebrow">Account settings</p><h1 className="section-title">Your profile</h1>
      <div className="mt-7 max-w-2xl rounded-3xl bg-white p-7 shadow-card"><dl className="grid gap-5 sm:grid-cols-2">
        {Object.entries({ Name: user?.name, Email: user?.email, Phone: user?.phone || 'Not provided', Account: user?.role }).map(([label, value]) =>
          <div key={label}><dt className="text-xs font-bold uppercase tracking-widest text-ink/45">{label}</dt><dd className="mt-2 font-semibold">{value}</dd></div>)}
      </dl><p className="mt-7 border-t border-ink/10 pt-5 text-sm text-ink/55">Profile editing is not available yet. Your password and session token are never displayed here.</p></div>
    </section>
  </div>
}

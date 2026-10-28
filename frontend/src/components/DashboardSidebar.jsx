import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = {
  STUDENT: [['/student/dashboard', 'Overview'], ['/student/bookings', 'My bookings'], ['/student/favorites', 'Saved homes'], ['/student/profile', 'Profile']],
  OWNER: [['/owner/dashboard', 'Overview'], ['/owner/properties', 'My listings'], ['/owner/properties/new', 'Add a property'], ['/owner/bookings', 'Requests'], ['/owner/profile', 'Profile']],
  ADMIN: [['/admin/dashboard', 'Overview'], ['/admin/users', 'Users'], ['/admin/properties', 'Properties'], ['/admin/bookings', 'Bookings'], ['/admin/reports', 'Reports']],
}

export default function DashboardSidebar() {
  const { user } = useAuth()
  return <aside className="rounded-3xl bg-ink p-5 text-white">
    <p className="px-3 pb-4 text-xs font-bold uppercase tracking-[.2em] text-white/50">{user?.role?.toLowerCase()} workspace</p>
    <nav className="grid gap-1">{(links[user?.role] || []).map(([to, label]) =>
      <NavLink key={to} to={to} end className={({ isActive }) => `rounded-xl px-3 py-3 text-sm ${isActive ? 'bg-white text-ink font-bold' : 'text-white/75 hover:bg-white/10'}`}>{label}</NavLink>)}</nav>
  </aside>
}

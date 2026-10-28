import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  function signOut() { logout(); navigate('/') }
  const homeForRole = user?.role === 'OWNER' ? '/owner/dashboard' : user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'
  return <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/95 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
      <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-base text-white">R</span>rent<span className="text-orange">ease</span></Link>
      <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
        <NavLink to="/properties" className="hover:text-orange">Find a home</NavLink><NavLink to="/about" className="hover:text-orange">About</NavLink><NavLink to="/contact" className="hover:text-orange">Contact</NavLink>
      </nav>
      <div className="flex items-center gap-3">
        {user ? <><Link to={homeForRole} className="hidden text-sm font-semibold sm:block">Dashboard</Link><button onClick={signOut} className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold hover:bg-white">Log out</button></>
          : <><Link to="/login" className="hidden text-sm font-semibold sm:block">Log in</Link><Link to="/register" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink/90">Get started</Link></>}
      </div>
    </div>
  </header>
}

import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Unauthorized() {
  const { user } = useAuth()
  return <section className="mx-auto max-w-3xl px-5 py-24 text-center"><p className="eyebrow">Access restricted</p><h1 className="mt-2 font-display text-5xl">This space is not yours to enter.</h1><p className="mt-4 text-ink/60">{user ? 'Your account does not have access to that area.' : 'Please sign in to continue.'}</p><Link to={user ? '/' : '/login'} className="mt-7 inline-block rounded-full bg-ink px-6 py-3 font-bold text-white">{user ? 'Go home' : 'Log in'}</Link></section>
}

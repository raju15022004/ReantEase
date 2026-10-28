import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ErrorMessage from '../components/ErrorMessage'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    try {
      const user = await login({ email: form.get('email'), password: form.get('password') })
      const path = user.role === 'OWNER' ? '/owner/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'
      navigate(location.state?.from || path, { replace: true })
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  return <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
    <div className="flex flex-col justify-center"><p className="eyebrow">Welcome back</p><h1 className="font-display text-5xl">Good to have you home.</h1><p className="mt-5 max-w-md leading-7 text-ink/60">Sign in to follow your requests, saved homes and property listings.</p></div>
    <form onSubmit={submit} className="rounded-3xl bg-white p-7 shadow-card sm:p-10"><h2 className="font-display text-3xl">Log in</h2><ErrorMessage message={error} />
      <label className="mt-6 block text-sm font-semibold">Email<input name="email" type="email" required autoComplete="email" className="field mt-2" /></label>
      <label className="mt-4 block text-sm font-semibold">Password<input name="password" type="password" required autoComplete="current-password" className="field mt-2" /></label>
      <button disabled={busy} className="mt-7 w-full rounded-full bg-ink py-3.5 font-bold text-white disabled:opacity-50">{busy ? 'Signing in…' : 'Continue'}</button>
      <p className="mt-5 text-center text-sm text-ink/60">New to RentEase? <Link className="font-bold text-ink underline" to="/register">Create an account</Link></p>
      <p className="mt-5 text-center text-xs leading-5 text-ink/45">Your session is held in memory for this browser tab and ends when you refresh or close it.</p>
    </form>
  </div>
}

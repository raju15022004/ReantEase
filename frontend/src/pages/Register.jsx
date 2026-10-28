import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ErrorMessage from '../components/ErrorMessage'

export default function Register() {
  const { register } = useAuth()
  const [params] = useSearchParams()
  const roleDefault = params.get('role') === 'OWNER' ? 'OWNER' : 'STUDENT'
  const [role, setRole] = useState(roleDefault)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    if (form.get('password') !== form.get('confirmPassword')) { setBusy(false); setError('Passwords do not match.'); return }
    try {
      const user = await register({ name: form.get('name'), email: form.get('email'), password: form.get('password'), phone: form.get('phone'), role })
      navigate(location.state?.from || (user.role === 'OWNER' ? '/owner/dashboard' : '/student/dashboard'), { replace: true })
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  return <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:py-16">
    <div className="flex flex-col justify-center"><p className="eyebrow">Make yourself at home</p><h1 className="font-display text-5xl">Find your people. Find your place.</h1><p className="mt-5 max-w-md leading-7 text-ink/60">Join RentEase to discover homes or share a property with people looking for their next step.</p></div>
    <form onSubmit={submit} className="rounded-3xl bg-white p-7 shadow-card sm:p-9"><h2 className="font-display text-3xl">Create an account</h2><ErrorMessage message={error} />
      <label className="mt-5 block text-sm font-semibold">I am joining as<select value={role} onChange={(e) => setRole(e.target.value)} className="field mt-2"><option value="STUDENT">A student / home seeker</option><option value="OWNER">A property owner</option></select></label>
      <label className="mt-4 block text-sm font-semibold">Full name<input name="name" required maxLength="120" autoComplete="name" className="field mt-2" /></label>
      <label className="mt-4 block text-sm font-semibold">Email<input name="email" type="email" required autoComplete="email" className="field mt-2" /></label>
      <label className="mt-4 block text-sm font-semibold">Phone (optional)<input name="phone" type="tel" autoComplete="tel" className="field mt-2" /></label>
      <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Password<input name="password" type="password" required minLength="8" maxLength="72" autoComplete="new-password" className="field mt-2" /></label>
        <label className="text-sm font-semibold">Confirm password<input name="confirmPassword" type="password" required minLength="8" autoComplete="new-password" className="field mt-2" /></label></div>
      <button disabled={busy} className="mt-6 w-full rounded-full bg-ink py-3.5 font-bold text-white disabled:opacity-50">{busy ? 'Creating…' : 'Create account'}</button>
      <p className="mt-5 text-center text-sm text-ink/60">Already registered? <Link className="font-bold underline" to="/login">Log in</Link></p>
    </form>
  </div>
}

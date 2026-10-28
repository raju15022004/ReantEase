import { useEffect, useState } from 'react'
import DashboardSidebar from '../components/DashboardSidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { adminService } from '../services/adminService'
import { humanize } from '../utils/format'

export default function AdminUsers() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  async function load() { try { setData(await adminService.users()) } catch (e) { setError(e.message) } }
  useEffect(load, [])
  async function toggle(user) { try { await adminService.setUserStatus(user.id, !user.enabled); await load() } catch (e) { setError(e.message) } }
  return <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-8"><DashboardSidebar /><section>
    <p className="eyebrow">Platform administration</p><h1 className="section-title">User accounts</h1><ErrorMessage message={error} onRetry={load} />
    {!data ? <LoadingSpinner /> : <div className="mt-7 overflow-x-auto rounded-3xl bg-white shadow-card"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-cream text-xs uppercase text-ink/50"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>
      {data.content.map((user) => <tr key={user.id} className="border-t border-ink/5"><td className="p-4 font-semibold">{user.name}</td><td className="p-4">{user.email}</td><td className="p-4">{humanize(user.role)}</td><td className="p-4">{user.enabled ? 'Enabled' : 'Disabled'}</td><td className="p-4">{user.role !== 'ADMIN' && <button onClick={() => toggle(user)} className="rounded-full border px-3 py-1.5 font-semibold">{user.enabled ? 'Disable' : 'Enable'}</button>}</td></tr>)}
      {!data.content.length && <tr><td colSpan="5" className="p-6 text-center text-ink/60">No user accounts found.</td></tr>}
    </tbody></table></div>}
  </section></div>
}

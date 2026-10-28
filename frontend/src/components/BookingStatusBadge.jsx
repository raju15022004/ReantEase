import { humanize } from '../utils/format'

export default function BookingStatusBadge({ status }) {
  const color = { PENDING: 'bg-amber-100 text-amber-800', ACCEPTED: 'bg-green-100 text-green-800', REJECTED: 'bg-red-100 text-red-800', CANCELLED: 'bg-gray-100 text-gray-700' }[status] || 'bg-gray-100'
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{humanize(status)}</span>
}

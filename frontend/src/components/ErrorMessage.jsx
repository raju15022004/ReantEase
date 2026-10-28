export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null
  return <div role="alert" className="my-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
    <span>{message}</span>{onRetry && <button className="ml-4 font-semibold underline" onClick={onRetry}>Try again</button>}
  </div>
}

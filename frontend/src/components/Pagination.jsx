export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages < 2) return null
  return <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3">
    <button disabled={page <= 0} onClick={() => onChange(page - 1)} className="rounded-full border px-4 py-2 disabled:opacity-40">Previous</button>
    <span className="text-sm">Page {page + 1} of {totalPages}</span>
    <button disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)} className="rounded-full border px-4 py-2 disabled:opacity-40">Next</button>
  </nav>
}

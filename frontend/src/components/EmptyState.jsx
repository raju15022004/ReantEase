export default function EmptyState({ title = 'Nothing here yet', message = 'Try changing your filters or come back later.' }) {
  return <div className="rounded-3xl border border-dashed border-ink/20 bg-white px-6 py-14 text-center">
    <div className="mb-3 text-3xl" aria-hidden="true">⌂</div>
    <h3 className="font-display text-2xl">{title}</h3><p className="mt-2 text-ink/60">{message}</p>
  </div>
}

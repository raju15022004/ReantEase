import { useEffect, useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import { favoriteService } from '../services/favoriteService'

export default function Favorites() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  function load() { favoriteService.list().then(setItems).catch((e) => setError(e.message)) }
  useEffect(load, [])
  return <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><p className="eyebrow">Your shortlist</p><h1 className="section-title">Saved homes</h1>
    {error && <ErrorMessage message={error} onRetry={load} />}{!items ? <LoadingSpinner /> : items.length ?
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((property) => <PropertyCard key={property.id} property={property} initiallyFavorite
        onFavoriteChange={(id, isFavorite) => { if (!isFavorite) setItems((current) => current.filter((item) => item.id !== id)) }} />)}</div> :
      <div className="mt-8"><EmptyState title="Your shortlist is waiting" message="Tap the heart on a home you like to save it here." /></div>}
  </section>
}

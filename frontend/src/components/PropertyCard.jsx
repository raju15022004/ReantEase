import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { favoriteService } from '../services/favoriteService'
import { formatCurrency, propertyImage, humanize } from '../utils/format'

export default function PropertyCard({ property, initiallyFavorite = false, onFavoriteChange }) {
  const { user } = useAuth()
  const [favorite, setFavorite] = useState(initiallyFavorite)
  const [busy, setBusy] = useState(false)

  async function toggleFavorite() {
    if (!user || user.role !== 'STUDENT' || busy) return
    setBusy(true)
    try {
      if (favorite) await favoriteService.remove(property.id)
      else await favoriteService.add(property.id)
      setFavorite(!favorite)
      onFavoriteChange?.(property.id, !favorite)
    } catch (error) {
      window.alert(error.message)
    } finally {
      setBusy(false)
    }
  }

  return <article className="group overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-1">
    <div className="relative h-56 overflow-hidden">
      <img src={propertyImage(property)} alt={property.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold">{humanize(property.propertyType)}</span>
      {user?.role === 'STUDENT' && <button aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={toggleFavorite} disabled={busy} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-xl shadow">
        {favorite ? '♥' : '♡'}
      </button>}
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-semibold leading-snug">{property.title}</h3>
        <span className="shrink-0 text-sm font-bold text-orange">{formatCurrency(property.monthlyRent)}<small className="font-normal text-ink/50">/mo</small></span>
      </div>
      <p className="mt-2 text-sm text-ink/60">{property.locality}, {property.city}</p>
      <div className="mt-4 flex flex-wrap gap-2">{(property.amenities || []).slice(0, 3).map((amenity) =>
        <span key={amenity} className="rounded-full bg-cream px-3 py-1 text-xs">{amenity}</span>)}
        <span className="rounded-full bg-cream px-3 py-1 text-xs">{property.availableRooms} room{property.availableRooms === 1 ? '' : 's'}</span>
      </div>
      <Link to={`/properties/${property.id}`} className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-ink/20 px-5 py-3 text-sm font-semibold transition hover:bg-ink hover:text-white">View details</Link>
    </div>
  </article>
}

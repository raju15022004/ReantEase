
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'
import PropertyFilters from '../components/PropertyFilters'
import PropertyMap from '../components/PropertyMap'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'
import { propertyService } from '../services/propertyService'

function fromParams(params) {
  return {
    location: params.get('location') || '',
    minRent: params.get('minRent') || '',
    maxRent: params.get('maxRent') || '',
    type: params.get('type') || '',
    occupancy: params.get('occupancy') || '',
    amenities: params.get('amenities') || '',
    availableOnly: params.get('availableOnly') !== 'false',
    sort: params.get('sort') || 'newest',
    page: Number(params.get('page') || 0),
  }
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (degrees) => (degrees * Math.PI) / 180
  const earthRadius = 6371

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function PropertyList() {
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState(() => fromParams(params))
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [radius, setRadius] = useState('5')
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [showMap, setShowMap] = useState(true)

  useEffect(() => {
    const next = fromParams(params)

    setFilters(next)
    setLoading(true)
    setError('')

    propertyService
      .search({
        ...next,
        size: 9,
        amenities: next.amenities || undefined,
      })
      .then(setResult)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [params])

  function update(next) {
    setFilters(next)

    const query = new URLSearchParams()

    Object.entries(next).forEach(([key, value]) => {
      if (key === 'page' && value === 0) return
      if (key === 'availableOnly' && value === true) return

      if (value !== '' && value !== undefined && value !== null) {
        query.set(key, value)
      }
    })

    setParams(query)
  }

  function findNearMe() {
    setLocationError('')

    if (!navigator.geolocation) {
      setLocationError(
        'Your browser does not support location access.'
      )
      return
    }

    setLocationLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationLoading(false)
      },
      (error) => {
        setLocationError(
          error.code === 1
            ? 'Location permission denied. Allow location access in browser settings.'
            : 'Unable to get your location. Please try again.'
        )
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  const allProperties = result?.content || []

  const visibleProperties = userLocation
    ? allProperties.filter((property) => {
        if (
          property.latitude == null ||
          property.longitude == null
        ) {
          return false
        }

        const latitude = Number(property.latitude)
        const longitude = Number(property.longitude)

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          return false
        }

        const distance = getDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          latitude,
          longitude
        )

        return distance <= Number(radius)
      })
    : allProperties

  const mapLatitude =
    userLocation?.latitude ?? visibleProperties[0]?.latitude

  const mapLongitude =
    userLocation?.longitude ?? visibleProperties[0]?.longitude

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <p className="eyebrow">Explore RentEase</p>

      <h1 className="section-title">Find a place that fits.</h1>

      <p className="mt-3 text-ink/60">
        Browse owner-submitted listings. Availability and details
        should be confirmed directly with the owner.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={findNearMe}
          disabled={locationLoading}
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {locationLoading
            ? 'Finding location...'
            : 'Find Near Me'}
        </button>

        {userLocation && (
          <>
            <label className="flex items-center gap-2 text-sm">
              Radius

              <select
                value={radius}
                onChange={(event) =>
                  setRadius(event.target.value)
                }
                className="field"
              >
                <option value="2">2 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => {
                setUserLocation(null)
                setLocationError('')
              }}
              className="rounded-full border px-4 py-2 text-sm"
            >
              Clear location
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setShowMap((previous) => !previous)}
          className="rounded-full border px-4 py-2 text-sm font-semibold"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      {locationError && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {locationError}
        </p>
      )}

      <div className="mt-8 grid items-start gap-7 lg:grid-cols-[270px_1fr]">
        <PropertyFilters
          filters={filters}
          onChange={update}
        />

        <div className="min-w-0">
          {showMap && !loading && !error && (
            <div className="mb-6">
              <PropertyMap
                latitude={mapLatitude}
                longitude={mapLongitude}
                properties={visibleProperties}
              />

              <p className="mt-2 text-xs text-ink/60">
                Click a property marker to view its location,
                monthly rent, and details.
              </p>
            </div>
          )}

          {loading ? (
            <LoadingSpinner label="Searching homes..." />
          ) : error ? (
            <ErrorMessage
              message={error}
              onRetry={() =>
                setParams(new URLSearchParams(params))
              }
            />
          ) : visibleProperties.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-ink/60">
                {userLocation
                  ? `${visibleProperties.length} properties within ${radius} km in the loaded results`
                  : `${result?.totalElements ?? visibleProperties.length} homes found`}
              </p>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visibleProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>

              {!userLocation && (
                <Pagination
                  page={result.page}
                  totalPages={result.totalPages}
                  onChange={(page) =>
                    update({ ...filters, page })
                  }
                />
              )}
            </>
          ) : (
            <EmptyState
              title={
                userLocation
                  ? 'No nearby homes found'
                  : 'No homes match just yet'
              }
              message={
                userLocation
                  ? `No properties within ${radius} km were found in the loaded results. Try a larger radius.`
                  : 'Try widening your budget or changing your location filters.'
              }
            />
          )}
        </div>
      </div>
    </section>
  )
}

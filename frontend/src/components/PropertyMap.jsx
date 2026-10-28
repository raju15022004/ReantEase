
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMap,
} from 'react-leaflet'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'

function MapCenter({ center }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom())
    }
  }, [center, map])

  return null
}

export default function PropertyMap({
  latitude,
  longitude,
  properties = [],
}) {
  const validProperties = properties.filter(
    (property) =>
      property.latitude != null &&
      property.longitude != null &&
      Number.isFinite(Number(property.latitude)) &&
      Number.isFinite(Number(property.longitude))
  )

  const hasUserLocation =
    latitude != null &&
    longitude != null &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude))

  const firstProperty = validProperties[0]

  const center = hasUserLocation
    ? [Number(latitude), Number(longitude)]
    : firstProperty
      ? [Number(firstProperty.latitude), Number(firstProperty.longitude)]
      : null

  if (!center) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-ink/60">
        No map coordinates available. Please add a property with valid
        latitude and longitude.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
      >
        <MapCenter center={center} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validProperties.map((property) => (
          <Marker
            key={property.id}
            position={[
              Number(property.latitude),
              Number(property.longitude),
            ]}
          >
            <Popup>
              <div className="min-w-36">
                <h3 className="font-semibold">{property.title}</h3>

                <p className="mt-1">
                  {property.locality}, {property.city}
                </p>

                <p className="mt-1 font-semibold">
                  ₹{property.monthlyRent}/month
                </p>

                <Link
                  to={`/properties/${property.id}`}
                  className="mt-2 inline-block text-blue-600 underline"
                >
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}


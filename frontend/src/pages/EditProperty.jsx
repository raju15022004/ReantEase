import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PropertyForm from '../components/PropertyForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { propertyService } from '../services/propertyService'

export default function EditProperty() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { propertyService.owned(id).then(setProperty).catch((e) => setError(e.message)) }, [id])
  if (error) return <div className="mx-auto max-w-5xl px-5 py-12"><ErrorMessage message={error} /></div>
  if (!property) return <LoadingSpinner />
  return <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8"><p className="eyebrow">Update listing</p><h1 className="section-title">Edit your property</h1>
    <p className="mb-7 mt-3 text-sm text-ink/60">Saving changes sends this listing back for review.</p>
    <PropertyForm initial={property} submitLabel="Save changes" onSubmit={async (details) => { await propertyService.update(id, details); navigate('/owner/properties') }} />
  </section>
}

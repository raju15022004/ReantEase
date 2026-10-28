import { useNavigate } from 'react-router-dom'
import PropertyForm from '../components/PropertyForm'
import { propertyService } from '../services/propertyService'

export default function AddProperty() {
  const navigate = useNavigate()
  return <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8"><p className="eyebrow">For property owners</p><h1 className="section-title">Add a property</h1>
    <p className="mb-7 mt-3 text-ink/60">Your listing will be reviewed before it appears in public search results.</p>
    <PropertyForm submitLabel="Submit for review" onSubmit={async (details) => { await propertyService.create(details); navigate('/owner/properties', { state: { notice: 'Property submitted for review.' } }) }} />
  </section>
}

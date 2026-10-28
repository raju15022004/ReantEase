import { useState } from 'react'
import { propertyImage } from '../utils/format'

export default function PropertyGallery({ property }) {
  const images = property.imageUrls?.length ? property.imageUrls : [propertyImage(property)]
  const [active, setActive] = useState(images[0])
  return <div>
    <div className="h-[420px] overflow-hidden rounded-3xl bg-leaf/30"><img src={active} alt={property.title} className="h-full w-full object-cover" /></div>
    {images.length > 1 && <div className="mt-3 flex gap-3 overflow-auto">{images.map((image) =>
      <button key={image} onClick={() => setActive(image)} className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl ${image === active ? 'ring-2 ring-ink' : ''}`}>
        <img src={image} alt="" className="h-full w-full object-cover" />
      </button>)}</div>}
  </div>
}

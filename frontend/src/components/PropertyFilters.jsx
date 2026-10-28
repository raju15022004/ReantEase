
export default function PropertyFilters({ filters, onChange }) {
  function change(event) {
    const { name, value, checked, type } = event.target

    onChange({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
      page: 0,
    })
  }

  return (
    <aside className="h-fit rounded-3xl bg-white p-6 shadow-card">
      <h2 className="font-display text-2xl">Filters</h2>

      {/* City or Locality */}
      <label className="mt-5 block text-sm font-semibold">
        City or locality
        <input
          name="location"
          value={filters.location || ''}
          onChange={change}
          className="field mt-2"
          placeholder="Search places"
        />
      </label>

      {/* Rent Range */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold">
          Min rent
          <input
            name="minRent"
            type="number"
            min="0"
            value={filters.minRent || ''}
            onChange={change}
            className="field mt-2"
          />
        </label>

        <label className="text-sm font-semibold">
          Max rent
          <input
            name="maxRent"
            type="number"
            min="0"
            value={filters.maxRent || ''}
            onChange={change}
            className="field mt-2"
          />
        </label>
      </div>

      {/* Property Type */}
      <label className="mt-4 block text-sm font-semibold">
        Property type
        <select
          name="type"
          value={filters.type || ''}
          onChange={change}
          className="field mt-2"
        >
          <option value="">All types</option>
          <option value="PG">PG</option>
          <option value="ROOM">Room</option>
          <option value="FLAT">Flat</option>
          <option value="HOSTEL">Hostel</option>
        </select>
      </label>

      {/* Occupancy */}
      <label className="mt-4 block text-sm font-semibold">
        Occupancy
        <select
          name="occupancy"
          value={filters.occupancy || ''}
          onChange={change}
          className="field mt-2"
        >
          <option value="">Any occupancy</option>
          <option value="SINGLE">Single</option>
          <option value="DOUBLE">Double</option>
          <option value="SHARED">Shared</option>
        </select>
      </label>

      {/* Room Availability */}
      <label className="mt-4 block text-sm font-semibold">
        Room availability
        <select
          name="roomAvailability"
          value={filters.roomAvailability || ''}
          onChange={change}
          className="field mt-2"
        >
          <option value="">All rooms</option>
          <option value="AVAILABLE">Rooms available</option>
          <option value="FULL">Fully occupied</option>
        </select>
      </label>

      {/* Amenities */}
      <fieldset className="mt-5">
        <legend className="text-sm font-semibold">Amenities</legend>

        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          {['Wi-Fi', 'AC', 'Meals', 'Furnished', 'Parking'].map(
            (amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={(filters.amenities || '')
                    .split(',')
                    .includes(amenity)}
                  onChange={() => {
                    const selected = new Set(
                      (filters.amenities || '')
                        .split(',')
                        .filter(Boolean)
                    )

                    if (selected.has(amenity)) {
                      selected.delete(amenity)
                    } else {
                      selected.add(amenity)
                    }

                    onChange({
                      ...filters,
                      amenities: [...selected].join(','),
                      page: 0,
                    })
                  }}
                />

                {amenity}
              </label>
            )
          )}
        </div>
      </fieldset>

      {/* Sort */}
      <label className="mt-4 block text-sm font-semibold">
        Sort by
        <select
          name="sort"
          value={filters.sort || 'newest'}
          onChange={change}
          className="field mt-2"
        >
          <option value="newest">Newest</option>
          <option value="rent_asc">Rent: low to high</option>
          <option value="rent_desc">Rent: high to low</option>
        </select>
      </label>

      {/* Available Now */}
      <label className="mt-5 flex items-center gap-3 text-sm">
        <input
          name="availableOnly"
          type="checkbox"
          checked={filters.availableOnly !== false}
          onChange={change}
        />
        Available now
      </label>
    </aside>
  )
}


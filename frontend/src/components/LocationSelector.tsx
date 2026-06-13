import React, { useState, useEffect } from "react"

interface LocationSelectorProps {
  onLocationChange: (countryId: string, stateId: string, cityId: string) => void;
  required?: boolean;
}

interface Item {
  id: string;
  name: string;
}

export function LocationSelector({ onLocationChange, required = false }: LocationSelectorProps) {
  const [countries, setCountries] = useState<Item[]>([])
  const [states, setStates] = useState<Item[]>([])
  const [cities, setCities] = useState<Item[]>([])

  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  useEffect(() => {
    // Fetch countries
    fetch("/api/location.php?type=getCountries")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.countries) {
          setCountries(data.countries)
        }
      })
      .catch((err) => console.error("Error fetching countries:", err))
  }, [])

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value
    setSelectedCountry(countryId)
    setSelectedState("")
    setSelectedCity("")
    setStates([])
    setCities([])
    onLocationChange(countryId, "", "")

    if (countryId) {
      fetch(`/api/location.php?type=getStates&countryId=${countryId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.states) {
            setStates(data.states)
          }
        })
        .catch((err) => console.error("Error fetching states:", err))
    }
  }

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value
    setSelectedState(stateId)
    setSelectedCity("")
    setCities([])
    onLocationChange(selectedCountry, stateId, "")

    if (stateId) {
      fetch(`/api/location.php?type=getCities&stateId=${stateId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.cities) {
            setCities(data.cities)
          }
        })
        .catch((err) => console.error("Error fetching cities:", err))
    }
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value
    setSelectedCity(cityId)
    onLocationChange(selectedCountry, selectedState, cityId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Country</label>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          required={required}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">State</label>
        <select
          value={selectedState}
          onChange={handleStateChange}
          required={required}
          disabled={!selectedCountry}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">City</label>
        <select
          value={selectedCity}
          onChange={handleCityChange}
          required={required}
          disabled={!selectedState}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

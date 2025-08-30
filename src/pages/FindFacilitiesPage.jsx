// src/pages/FindFacilitiesPage.jsx

import React, { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: 22.5726,
  lng: 88.3639
}

// The new API requires the 'marker' library for advanced markers
const libraries = ['places', 'geocoding', 'marker']

const FindFacilitiesPage = ({ onNavigate }) => {
  const [searchCity, setSearchCity] = useState('')
  const [searchRadius, setSearchRadius] = useState(5000) // Radius is now a number
  const [searchType, setSearchType] = useState('hospital')
  const [facilities, setFacilities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [map, setMap] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  })

  const handleSearch = async () => {
    if (!map || !searchCity) {
      setError('Please enter a city name to search.')
      return
    }
    setIsLoading(true)
    setError('')
    setFacilities([])
    setSelectedPlace(null)

    try {
      // Step 1: Geocoding (same as before)
      const geocoder = new window.google.maps.Geocoder()
      const geocodePromise = new Promise((resolve, reject) => {
        geocoder.geocode({ address: searchCity }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].geometry.location)
          } else {
            reject(new Error(`Could not find location for "${searchCity}".`))
          }
        })
      })

      const location = await geocodePromise
      map.panTo(location)
      map.setZoom(12)

      // --- STEP 2: MODERN NEARBY SEARCH ---
      // This is the new, correct way to search for nearby places.
      const { Place } = await window.google.maps.importLibrary("places");
      
      const request = {
        locationRestriction: {
          center: location,
          radius: searchRadius,
        },
        includedTypes: [searchType],
        // You must specify which fields you want the API to return
        fields: ['displayName', 'location', 'formattedAddress'], 
      };

      // @ts-ignore
      const { places } = await Place.searchNearby(request);

      if (places.length) {
        setFacilities(places);
      } else {
        setError(`No '${searchType}' facilities were found in the selected area.`);
      }
      // ------------------------------------

    } catch (err) {
      console.error('Search failed:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (loadError) {
    return <div>Error loading maps. Please check your API key.</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <button onClick={() => onNavigate('home')} className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Home
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Healthcare Facilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 text-left">City Name</label>
              <Input placeholder="e.g., Kolkata" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">Radius</label>
              <select value={searchRadius} onChange={(e) => setSearchRadius(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value={1000}>1 km</option>
                <option value={5000}>5 km</option>
                <option value={10000}>10 km</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 text-left">Type</label>
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="hospital">Hospital</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-1/4 md:ml-auto">
             <Button onClick={handleSearch} disabled={isLoading || !isLoaded}>
                {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

          <div className="mt-6 border rounded-lg h-96 bg-gray-100">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={10}
                onLoad={mapInstance => setMap(mapInstance)}
              >
                {facilities.map((place) => (
                  <Marker 
                    key={place.displayName} 
                    position={place.location} 
                    title={place.displayName}
                    onClick={() => setSelectedPlace(place)}
                  />
                ))}
                {selectedPlace && (
                  <InfoWindow
                    position={selectedPlace.location}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <div>
                      <h3 className="font-bold">{selectedPlace.displayName}</h3>
                      <p className="text-sm text-gray-600">{selectedPlace.formattedAddress}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : <p>Loading Map...</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default FindFacilitiesPage
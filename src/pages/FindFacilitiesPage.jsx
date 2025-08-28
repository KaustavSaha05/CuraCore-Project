// src/pages/FindFacilitiesPage.jsx

import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Button from '../components/common/Button.jsx';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center for the map (Kolkata, India)
const defaultCenter = {
  lat: 22.5726,
  lng: 88.3639
};

const libraries = ['places'];

const FindFacilitiesPage = ({ onNavigate }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);

  // --- ADD THIS LINE FOR DEBUGGING ---
  console.log("Key being used by map:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  // ------------------------------------

  // This hook loads the Google Maps script
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  const handleFind = () => {
    if (!map) return;
    setIsLoading(true);
    setError('');
    setFacilities([]);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
      return;
    }

    // Get the user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        map.panTo(location); // Move the map to the user's location
        map.setZoom(14);

        const service = new window.google.maps.places.PlacesService(map);
        const request = {
          location: location,
          radius: '5000', // 5km radius
          type: ['hospital', 'pharmacy', 'doctor'],
        };

        // Search for nearby places
        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            setFacilities(results);
          }
          setIsLoading(false);
        });
      },
      () => {
        setError("Location permission denied. Please enable it in your browser.");
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <button onClick={() => onNavigate('home')} className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Home
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Healthcare Facilities Near You</h2>
          <div className="w-64 mx-auto">
             <Button onClick={handleFind} disabled={isLoading || !isLoaded}>
                {isLoading ? 'Searching...' : 'Find Facilities Near Me'}
            </Button>
          </div>
          
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {!isLoaded && <p className="text-gray-500 mt-4">Loading Map...</p>}

          <div className="mt-6 border rounded-lg h-96 bg-gray-100">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={12}
                onLoad={mapInstance => setMap(mapInstance)}
              >
                {/* Add markers for the user and the found facilities */}
                {userLocation && <Marker position={userLocation} title="Your Location" />}
                {facilities.map((place, i) => (
                  <Marker key={i} position={place.geometry.location} title={place.name} />
                ))}
              </GoogleMap>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindFacilitiesPage;
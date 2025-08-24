/**
 * This function finds nearby healthcare facilities.
 * It needs the 'map' object created by the Google Maps script.
 * We wrap the callback-based 'nearbySearch' in a Promise to use async/await.
 */
export const findNearbyFacilities = (map, userLocation) => {
  return new Promise((resolve, reject) => {
    // Check if the Google Maps script has loaded
    if (!window.google) {
      return reject(new Error("Google Maps script not loaded."));
    }

    const request = {
      location: userLocation, // An object like { lat: 22.57, lng: 88.36 }
      radius: '5000', // Search within a 5km radius
      type: ['hospital', 'pharmacy', 'doctor'], // Types of places to search for
    };

    const service = new window.google.maps.places.PlacesService(map);

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // If the search is successful, resolve the promise with the results
        resolve(results);
      } else {
        // If there's an error, reject the promise
        reject(new Error(`Places search failed with status: ${status}`));
      }
    });
  });
};
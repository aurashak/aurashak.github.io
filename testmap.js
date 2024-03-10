 // Create and configure the map
 var map = L.map('testmap', {
  // Your map configuration here
}).setView([40.7128, -74.0060], 12); // New York City coordinates

L.control.scale().addTo(map);

// Ambee API integration
var apiKey = 'f02201cea751d78924d06b38421c2d67433278fd738d81e7e90842a565560dda';
var apiUrl = 'https://api.ambeedata.com/...'; // Replace with the actual Ambee API endpoint

fetch(apiUrl, {
  headers: {
      'x-api-key': apiKey,
  },
})
  .then(response => response.json())
  .then(data => {
      // Process and use the Ambee API data
      console.log(data);

      // Example: Display air quality information as a popup on the map
      L.marker([data.latitude, data.longitude])
          .addTo(map)
          .bindPopup('Air Quality: ' + data.air_quality);
  })
  .catch(error => {
      console.error('Error fetching Ambee API:', error);
  });
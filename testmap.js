// Define the bounds for the New York City Tri-State area
var bounds = L.latLngBounds(
  L.latLng(40.4774, -74.2591), // Southwest corner
  L.latLng(41.15, -73.3913)  // Northeast corner
);

// Create and configure the map with the specified bounds
var map = L.map('nymap', {
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,   // Elastic effect on exceeding bounds
  minZoom: 10,
  maxZoom: 16
}).setView([40.7128, -74.0060], 12); // New York City coordinates

// Add Google Maps base layer
var googleLayer = new L.Google('ROADMAP');
map.addLayer(googleLayer);

L.control.scale().addTo(map);

// Add a marker for air quality data (replace with your actual data)
var airQualityMarker = L.marker([YOUR_LATITUDE, YOUR_LONGITUDE]).addTo(map);

// You can customize the marker icon or popup content as needed
airQualityMarker.bindPopup("<b>Air Quality Information</b><br>Insert your data here.").openPopup();

// Fetch air quality data from Google Maps API
fetch('https://maps.googleapis.com/maps/api/js/third_party/air_quality?units=metric&lat=' + YOUR_LATITUDE + '&lng=' + YOUR_LONGITUDE + '&key=YOUR_GOOGLE_MAPS_API_KEY')
  .then(response => response.json())
  .then(data => {
    // Process the air quality data and update the map as needed
    console.log(data);
  })
  .catch(error => console.error('Error fetching air quality data:', error));



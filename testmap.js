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
fetch('https://maps.googleapis.com/maps/api/js/third_party/air_quality?units=metric&lat=' + YOUR_LATITUDE + '&lng=' + YOUR_LONGITUDE + '&key=AIzaSyCqS_XpeXz_1mapPnMseO2s0SHiHyal9t0')
  .then(response => response.json())
  .then(data => {
    // Process the air quality data and update the map as needed
    console.log(data);
  })
  .catch(error => console.error('Error fetching air quality data:', error));



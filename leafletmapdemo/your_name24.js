// Initialize Leaflet map
var map = L.map('nymap').setView([40.7128, -74.0060], 13); // Set center to New York City and zoom level

// Add a tile layer to the map (for example, OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add a marker to the map for New York City
var marker = L.marker([40.7128, -74.0060]).addTo(map);

// Add a popup to the marker
marker.bindPopup("<b>Hello New York City!</b><br>This is a Leaflet map.").openPopup();

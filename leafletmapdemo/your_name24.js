// Initialize Leaflet map
var map = L.map('nymap').setView([51.505, -0.09], 13); // Set initial center and zoom level

// Add a tile layer to the map (for example, OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add a marker to the map
var marker = L.marker([51.5, -0.09]).addTo(map);

// Add a popup to the marker
marker.bindPopup("<b>Hello world!</b><br>This is a Leaflet map.").openPopup();

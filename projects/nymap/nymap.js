// Initialize the map
var mymap = L.map('map').setView([40.7128, -74.0060], 12); // New York City coordinates

// Add a tile layer (you can use different map providers)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Add a marker for a specific location (optional)
var marker = L.marker([40.7128, -74.0060]).addTo(mymap);
marker.bindPopup("<b>New York City</b>").openPopup();

var map = L.map('map').setView([51.505, -0.09], 13); // Example coordinates

// Define the base layer (OpenStreetMap)
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add the base layer (OpenStreetMap) to the map
openStreetMap.addTo(map);

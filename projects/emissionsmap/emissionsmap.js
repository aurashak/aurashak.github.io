console.log("Leaflet and proj4 must be loaded first.");
console.log("Loading Leaflet...");
console.log("Loading proj4...");
console.log("Loading proj4leaflet...");

console.log("Custom script loading...");

// Custom script
console.log("Starting emissionsmap.js...");

// Initialize the map
var map = L.map('emissionsmap', {
    // Set initial center and zoom level for focusing on the world
    center: [0, 0], // Center coordinates to focus on the world
    zoom: 2, // Zoom level adjusted to show the world
    // Disable zooming and scrolling
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false
});

// Add tile layer from OpenStreetMap with only labels
console.log("Adding tile layer...");
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.5 // Adjust opacity for better visibility
}).addTo(map);

// Load GeoJSON file for the world map
console.log("Loading GeoJSON file...");
var geojsonLayer = new L.GeoJSON.AJAX("https://aurashak.github.io/geojson/world/worldcountries.geojson", {
    style: function(feature) {
        return {
            fillColor: 'green', // Fill color of the polygons
            weight: 1, // Stroke width
            opacity: 1, // Stroke opacity
            color: 'white', // Stroke color
            fillOpacity: 0.7 // Fill opacity
        };
    }
});

// Add the GeoJSON layer to the map
console.log("Adding GeoJSON layer...");
geojsonLayer.addTo(map);

// Zoom the map to the extent of the GeoJSON layer
console.log("Fitting map bounds...");
map.fitBounds(geojsonLayer.getBounds());

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
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    pane: 'labels', // Add labels to a separate pane
    minZoom: 2, // Set minimum zoom level
    maxZoom: 19, // Set maximum zoom level
    opacity: 0.5 // Adjust opacity for better visibility
}).addTo(map);

// Create a pane for the GeoJSON layer
map.createPane('geojsonPane');
map.getPane('geojsonPane').style.zIndex = 400; // Set z-index to appear above the tile layer

// Load GeoJSON file for the world map
var geojsonLayer = new L.GeoJSON.AJAX("https://aurashak.github.io/geojson/world/worldcountries.geojson", {
    style: function(feature) {
        return {
            fillColor: 'green', // Fill color of the polygons
            weight: 1, // Stroke width
            opacity: 1, // Stroke opacity
            color: 'white', // Stroke color
            fillOpacity: 0.7 // Fill opacity
        };
    },
    pane: 'geojsonPane' // Add GeoJSON layer to the custom pane
});

// Add the GeoJSON layer to the map
geojsonLayer.addTo(map);

// Zoom the map to the extent of the GeoJSON layer
map.fitBounds(geojsonLayer.getBounds());

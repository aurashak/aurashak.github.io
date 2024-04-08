// Define the Robinson projection
proj4.defs('EPSG:54030', '+proj=robin +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');

// Initialize the map
var map = L.map('emissionsmap', {
    crs: L.Proj.CRS('EPSG:54030'), // Use the custom CRS
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

// Add tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.5 // Adjust opacity for better visibility
}).addTo(map);

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
    }
});

// Add the GeoJSON layer to the map
geojsonLayer.addTo(map);

// Zoom the map to the extent of the GeoJSON layer
map.fitBounds(geojsonLayer.getBounds());

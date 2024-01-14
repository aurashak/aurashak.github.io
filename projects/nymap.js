// Initialize the map
var mymap = L.map('map').setView([40.7128, -74.0060], 12); // New York City coordinates

// Define the base layers
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var satelliteMap = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a> contributors'
});

// Create a group for overlay layers (TBD layers)
var overlayLayers = L.layerGroup();

// Add a marker for a specific location (optional)
var marker = L.marker([40.7128, -74.0060]).addTo(mymap);
marker.bindPopup("<b>New York City</b>").openPopup();

// Add the base layers to the map
openStreetMap.addTo(mymap);

// Define a scale control and add it to the map
L.control.scale().addTo(mymap);

// Create an object to hold the base layers
var baseMaps = {
    "OpenStreetMap": openStreetMap,
    "Satellite": satelliteMap
};

// Create an object to hold the overlay layers
var overlayMaps = {
    "TBD Layer": overlayLayers
};

// Add layer control to toggle between base layers and overlay layers
L.control.layers(baseMaps, overlayMaps).addTo(mymap);

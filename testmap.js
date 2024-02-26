// Create and configure the map with the specified bounds
var map = L.map('testmap').setView([40.7128, -74.0060], 12); // New York City coordinates, closer zoom level

L.control.scale().addTo(map);

// Base Map Layer - OpenStreetMap
var openstreetmapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    style: function (feature) {
        return {};
    }
});

openstreetmapLayer.addTo(map);

// GeoJSON Layer - Remediation Sites
var geojsonLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/remediationsites.geojson', {
    style: function (feature) {
        return {
            fillColor: 'green', // Set your desired fill color
            color: 'black',    // Set your desired border color
            weight: 2,          // Set the border weight
            opacity: 1          // Set the opacity
        };
    }
});

geojsonLayer.addTo(map);

// Console log for debugging
geojsonLayer.on('data:loaded', function () {
    console.log('GeoJSON data loaded successfully.');
});

geojsonLayer.on('data:loading', function () {
    console.log('Loading GeoJSON data...');
});

geojsonLayer.on('data:progress', function (e) {
    console.log('Loading progress:', e.processed, '/', e.total);
});

geojsonLayer.on('data:error', function (e) {
    console.error('Error loading GeoJSON data:', e.error);
});

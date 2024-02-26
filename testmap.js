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

// GeoJSON Layer - Remediation Sites (Polygons)
var remediationSitesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/remediationsites.geojson', {
    style: function (feature) {
        return {
            fillColor: 'green',
            color: 'black',
            weight: 2,
            opacity: 1
        };
    }
});

remediationSitesLayer.addTo(map);

// GeoJSON Layer - Streets (Lines)
var streetsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/mtsstreets.geojson', {
    style: function (feature) {
        return {
            color: 'blue',   // Set your desired line color
            weight: 2,       // Set the line weight
            opacity: 1       // Set the line opacity
        };
    }
});

streetsLayer.addTo(map);

// Console log for debugging
remediationSitesLayer.on('data:loaded', function () {
    console.log('Remediation sites GeoJSON data loaded successfully.');
});

streetsLayer.on('data:loaded', function () {
    console.log('Streets GeoJSON data loaded successfully.');
});

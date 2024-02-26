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

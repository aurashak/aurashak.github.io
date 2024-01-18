document.addEventListener("DOMContentLoaded", function () {
    // Define the bounds of the New York City metropolitan region
    var southWest = L.latLng(40.377399, -74.259090),
        northEast = L.latLng(41.134986, -73.700180),
        bounds = L.latLngBounds(southWest, northEast);

    // Initialize the map with a specific location and zoom level
    var map = L.map('map', {
        center: [40.7128, -74.0060], // New York City coordinates
        zoom: 10, // Initial zoom level
        minZoom: 10, // Minimum zoom level to restrict zooming out
        maxBounds: bounds, // Restrict panning to th New York City metropolitan region
        maxBoundsViscosity: 1.0 // Make the map bounce baack when dragged outside the bounds
    });

    // Define the base layers (OpenStreetMap, Satellite, and Surface Temperature)
    var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
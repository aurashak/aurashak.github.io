// Define the bounds for the New York City Tri-State area
var bounds = L.latLngBounds(
  L.latLng(40.4774, -74.2591), // Southwest corner
  L.latLng(41.15, -73.3913)  // Northeast corner
);

// Create and configure the map with the specified bounds
var map = L.map('nymap', {
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,   // Elastic effect on exceeding bounds
  minZoom: 10,
  maxZoom: 16
}).setView([40.7128, -74.0060], 12); // New York City coordinates

L.control.scale().addTo(map);
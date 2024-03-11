 // Create and configure the map
 var map = L.map('testmap', {
  // Your map configuration here
}).setView([40.7128, -74.0060], 12); // New York City coordinates

L.control.scale().addTo(map);


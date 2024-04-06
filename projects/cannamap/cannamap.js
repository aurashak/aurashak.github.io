// Initialize the map
var map = L.map('cannamap', {
    // Set initial center and zoom level
    center: [37.0902, -95.7129], // United States center coordinates
    zoom: 4,
    // Disable zooming and scrolling
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false
});

// Add base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch GeoJSON data and add it to the map as a layer
fetch('https://aurashak.github.io/projects/cannamap/maps/statesandprovinces.geojson')
    .then(response => response.json())
    .then(data => {
        // Add GeoJSON layer to the map with custom styles
        L.geoJSON(data, {
            style: function(feature) {
                return {
                    fillColor: 'green',    // Fill color (change to your desired color)
                    fillOpacity: 0.5,       // Fill opacity
                    color: 'blue',          // Border color (change to your desired color)
                    weight: 2               // Border weight
                };
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching GeoJSON data:', error);
    });

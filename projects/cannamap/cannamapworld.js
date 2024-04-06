// Initialize the map
var map = L.map('cannamap', {
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


// Add base map tiles with opacity set
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.5 // Set opacity to 50%
}).addTo(map);

// Fetch GeoJSON data and add all features to the map as a layer
fetch('https://aurashak.github.io/projects/cannamap/maps/countries.geojson')
    .then(response => response.json())
    .then(data => {
        console.log('Original GeoJSON data:', data); // Log original GeoJSON data

        // Create a new GeoJSON object with all features
        var allGeoJSON = {
            type: 'FeatureCollection',
            features: data.features
        };
        console.log('All GeoJSON:', allGeoJSON); // Log all GeoJSON object

        // Add all GeoJSON layer to the map with custom styles and tooltips
        L.geoJSON(allGeoJSON, {
            style: function(feature) {
                return {
                    fillColor: 'white',    // Fill color (change to your desired color)
                    fillOpacity: 0.9,       // Fill opacity
                    color: 'black',          // Border color (change to your desired color)
                    weight: .5               // Border weight
                };
            },
            onEachFeature: function(feature, layer) {
                // Extract data from the GeoJSON feature
                var tooltipText = feature.properties.admin; // Assuming the "admin" category holds the label information

                // Add tooltip to the layer
                layer.bindTooltip(tooltipText, { permanent: false, direction: 'center' });
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching GeoJSON data:', error);
    });

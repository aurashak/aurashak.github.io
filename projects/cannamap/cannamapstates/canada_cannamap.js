
// Initialize the map
var map = L.map('cannamap', {
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


// Fetch GeoJSON data for Canada and add to the map
fetch('https://aurashak.github.io/projects/cannamap/maps/statesandprovinces.geojson')
    .then(response => response.json())
    .then(data => {
        // Filter GeoJSON features to only include Canada
        var filteredData = data.features.filter(feature => feature.properties.geonunit === "Canada");

        // Create a new GeoJSON object with the filtered features
        var filteredGeoJSON = {
            type: 'FeatureCollection',
            features: filteredData
        };

        // Add filtered GeoJSON layer to the map with custom styles and tooltips
        L.geoJSON(filteredGeoJSON, {
            style: function(feature) {
                return {
                    fillColor: 'white',    // Fill color (change to your desired color)
                    fillOpacity: 0.9,       // Fill opacity
                    color: 'black',          // Border color (change to your desired color)
                    weight: .5               // Border weight
                };
            },
            onEachFeature: function(feature, layer) {
                var tooltipText = feature.properties.postal; // Assuming the category property holds the label information
                layer.bindTooltip(tooltipText, { permanent: false, direction: 'center' });
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching GeoJSON data:', error);
    });

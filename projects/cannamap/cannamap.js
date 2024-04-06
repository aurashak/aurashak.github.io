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

// Add base map tiles with opacity set
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.5 // Set opacity to 50%
}).addTo(map);

// Fetch GeoJSON data and add filtered features to the map as a layer
fetch('https://aurashak.github.io/projects/cannamap/maps/statesandprovinces.geojson')
    .then(response => response.json())
    .then(data => {
        console.log('Original GeoJSON data:', data); // Log original GeoJSON data

        // Filter GeoJSON features to only include those labeled "United States of America" in the "geounit" category
        var filteredData = data.features.filter(feature => feature.properties.geonunit === "United States of America");
        console.log('Filtered GeoJSON data:', filteredData); // Log filtered GeoJSON data

        // Create a new GeoJSON object with the filtered features
        var filteredGeoJSON = {
            type: 'FeatureCollection',
            features: filteredData
        };
        console.log('Filtered GeoJSON:', filteredGeoJSON); // Log filtered GeoJSON object

// Add filtered GeoJSON layer to the map with custom styles and labels
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
        // Extract data from the GeoJSON feature
        var label = feature.properties.postal; // Assuming the category property holds the label information

        // Get the centroid of the state polygon
        var centroid = layer.getBounds().getCenter();

        // Add label to the feature as a marker with custom icon
        var labelIcon = L.divIcon({
            className: 'label-icon',
            html: '<div>' + label + '</div>',
            iconAnchor: [10, 10] // Adjust the icon anchor to center the label
        });

        // Add marker with label icon at the centroid of the state
        L.marker(centroid, { icon: labelIcon }).addTo(map);
    }
}).addTo(map);


    })
    .catch(error => {
        console.error('Error fetching GeoJSON data:', error);
    });

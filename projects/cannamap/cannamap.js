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

// Fetch US state boundaries and country outline from provided GeoJSON URL
fetch('https://aurashak.github.io/projects/cannamap/maps/statesandprovinces.geojson')
    .then(response => response.json())
    .then(data => {
        console.log('GeoJSON data:', data); // Log GeoJSON data to console
        
        // Check if there are any features in the GeoJSON data
        if (data.features && data.features.length > 0) {
            console.log('Number of features:', data.features.length);
        } else {
            console.error('No features found in GeoJSON data');
            return;
        }
        
        // Create a GeoJSON layer
        var geojsonLayer = L.geoJSON(data, {
            filter: function(feature) {
                return feature.properties.category === 'adm0_a3';
            },
            style: {
                fillColor: 'white',    // Fill color (states)
                fillOpacity: 1,       // Solid fill
                color: 'black',      // Border color (states)
                weight: 2            // Border weight (states)
            },
            onEachFeature: function(feature, layer) {
                // Add state initials over each state
                const stateName = feature.properties.names;
                console.log('State name:', stateName); // Log state name to console
                L.marker(layer.getBounds().getCenter(), {
                    icon: L.divIcon({
                        className: 'state-initials',
                        html: stateName.substring(0, 2) // Display first two letters of state name
                    })
                }).addTo(map);
            }
        });
        
        // Add the GeoJSON layer to the map
        geojsonLayer.addTo(map);
    })
    .catch(error => {
        console.error('Error fetching data:', error); // Log error to console
    });

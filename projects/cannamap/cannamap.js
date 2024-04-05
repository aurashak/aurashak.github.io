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
        console.log('GeoJSON data:', data);
        L.geoJSON(data, {
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
                console.log('State name:', stateName);
                L.marker(layer.getBounds().getCenter(), {
                    icon: L.divIcon({
                        className: 'state-initials',
                        html: stateName.substring(0, 2) // Display first two letters of state name
                    })
                }).addTo(map);
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

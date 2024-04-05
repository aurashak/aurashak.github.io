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

// Fetch US state boundaries and country outline from OpenStreetMap
fetch('https://nominatim.openstreetmap.org/search?format=json&q=United States&limit=1')
    .then(response => response.json())
    .then(data => {
        console.log('Data for United States:', data);
        if (data && data.length > 0 && data[0].geojson) {
            const countryBoundaries = JSON.parse(data[0].geojson);
            L.geoJSON(countryBoundaries, {
                style: {
                    fillColor: 'red',    // Fill color (countries)
                    fillOpacity: 1,       // Solid fill
                    color: 'white',      // Border color (countries)
                    weight: 2            // Border weight (countries)
                }
            }).addTo(map);

            console.log('Ocean color:', map.getContainer().style.backgroundColor);

            // Add state initials over each state
            countryBoundaries.features.forEach(feature => {
                const stateCenter = feature.geometry.coordinates[0][0];
                const stateName = feature.properties.name;
                L.marker([stateCenter[1], stateCenter[0]], {
                    icon: L.divIcon({
                        className: 'state-initials',
                        html: stateName.substring(0, 2) // Display first two letters of state name
                    })
                }).addTo(map);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching country boundaries:', error);
    });

// Add the base layer (OpenStreetMap) after fetching data
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

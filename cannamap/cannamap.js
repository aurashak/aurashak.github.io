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

// Add the base layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch US state boundaries and country outline from OpenStreetMap
fetch('https://nominatim.openstreetmap.org/search?format=json&q=United States&limit=1')
    .then(response => response.json())
    .then(data => {
        console.log('Data for United States:', data);
        if (data && data.length > 0 && data[0].geojson) {
            const countryBoundaries = JSON.parse(data[0].geojson);
            L.geoJSON(countryBoundaries, {
                style: {
                    color: 'black',     // Border color
                    weight: 2            // Border weight
                }
            }).addTo(map);
        }
    })
    .catch(error => {
        console.error('Error fetching country boundaries:', error);
    });
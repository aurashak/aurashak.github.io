document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map with a specific location and zoom level
    var map = L.map('map', {
        center: [40.7128, -74.0060], // New York City coordinates
        zoom: 13, // Initial zoom level
        minZoom: 10 // Minimum zoom level to restrict zooming out
    });

    // Define the base layers (OpenStreetMap and Satellite)
    var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var satellite = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg', {
        attribution: '© <a href="https://s2maps.eu/">Sentinel-2 cloudless by EOX IT Services GmbH</a>'
    });

    // Create a layer group for base layers
    var baseLayers = {
        "OpenStreetMap": openStreetMap,
        "Satellite": satellite
    };

    // Add the base layers to the map
    openStreetMap.addTo(map); // By default, start with OpenStreetMap as the visible layer

    // Function to toggle base layers
    function toggleBaseLayer(layerName) {
        if (map.hasLayer(baseLayers[layerName])) {
            map.removeLayer(baseLayers[layerName]);
        } else {
            map.addLayer(baseLayers[layerName]);
        }
    }

    // Load and add the GeoJSON layer with initial style
    var geojsonLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/citywideoutfalls.geojson', {
        style: {
            color: 'blue', // Initial color
            weight: 2,      // Initial line weight
            opacity: 0.7    // Initial opacity
        }
    }).addTo(map);

    // Create a control panel for layer toggles
    var layerControl = L.control.layers(baseLayers, null, { position: 'topright' });

    layerControl.addTo(map); // Add the layer control to the map
});

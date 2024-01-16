document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map with a specific location and zoom level
    var map = L.map('map', {
        center: [40.7128, -74.0060], // New York City coordinates
        zoom: 13, // Initial zoom level
        minZoom: 10 // Minimum zoom level to restrict zooming out
    });

    // Define the base layers (OpenStreetMap and Satellite)
    var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var satellite = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg', {
        attribution: '&copy; <a href="https://s2maps.eu/">Sentinel-2 cloudless by EOX IT Services GmbH</a>'
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
    var geojsonLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nyccounties.geojson', {
        style: {
            color: 'blue', // Initial color
            weight: 2,      // Initial line weight
            opacity: 0.7    // Initial opacity
        }
    }).addTo(map);

    // Create a control panel for layer toggles
    var layerControl = L.control.layers(baseLayers, null, { position: 'topright' });

    layerControl.addTo(map);

    // Function to update the style based on user input
    function updateStyle() {
        var color = document.getElementById('color').value;
        var weight = document.getElementById('weight').value;
        var opacity = document.getElementById('opacity').value;

        geojsonLayer.setStyle({
            color: color,
            weight: weight,
            opacity: opacity
        });
    }

    // Add event listeners to input elements
    document.getElementById('color').addEventListener('input', updateStyle);
    document.getElementById('weight').addEventListener('input', updateStyle);
    document.getElementById('opacity').addEventListener('input', updateStyle);

    // Function to toggle base layers when clicking links
    document.getElementById('openStreetMapToggle').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default behavior of anchor links
        toggleBaseLayer('OpenStreetMap');
    });
    document.getElementById('satelliteToggle').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default behavior of anchor links
        toggleBaseLayer('Satellite');
    });

    // Define the bounds for New York City area
    var maxBounds = [
        [40.4774, -74.2591], // Southwestern corner coordinates
        [40.9176, -73.7004]  // Northeastern corner coordinates
    ];

    // Set the maximum bounds for the map
    map.setMaxBounds(maxBounds);
});

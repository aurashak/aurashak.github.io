document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map with options
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    // Define the OpenStreetMap layer
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    // Define the satellite layer
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
        attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
    });

    // Define a variable to hold the current visible layer
    var currentLayer = null;

    // Function to switch layers
    function switchLayer(layer) {
        if (currentLayer) {
            mymap.removeLayer(currentLayer);
        }
        mymap.addLayer(layer);
        currentLayer = layer;
    }

    // Define the GeoJSON layer
    var geojsonGroup = L.layerGroup();
    addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', {
        color: 'white',
        weight: 0.5,
        fillColor: 'black',
        fillOpacity: 1
    });
    // Add the GeoJSON layer by default
    switchLayer(geojsonGroup);

    // Function to add GeoJSON data to the map with mouseover event for country names
    function addGeoJSONToGroup(url, style) {
        // Fetch GeoJSON data and add it to the layer group
        fetch(url)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: style,
                    onEachFeature: function (feature, layer) {
                        if (feature.properties && feature.properties.ADMIN) {
                            layer.bindTooltip(feature.properties.ADMIN, {
                                permanent: false,
                                direction: 'auto',
                                className: 'country-tooltip',
                                sticky: true // Make the tooltip follow the cursor
                            });

                            layer.on('mouseover', function () {
                                this.openTooltip();
                            });
                            layer.on('mouseout', function () {
                                this.closeTooltip();
                            });
                        }
                    }
                }).addTo(geojsonGroup);
            });
    }

    // Button functions to switch between layers
    window.toggleOSMLayer = function() { switchLayer(osmLayer); }
    window.toggleSatelliteLayer = function() { switchLayer(satelliteLayer); }
    window.toggleGeoJSONLayer = function() { switchLayer(geojsonGroup); }

    // Add the search control to the map
    var searchControl = new L.Control.geocoder({
        placeholder: "Search for a place",
        geocoder: new L.Control.Geocoder.Nominatim()
    }).addTo(mymap);

    // Event listener for the search button
    var searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            var query = document.getElementById('search-input').value;
            searchControl.geocoder.geocode(query, function(results) {
                if (results.length > 0) {
                    var bbox = results[0].bbox;
                    mymap.fitBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
                } else {
                    alert('Location not found');
                }
            });
        });
    }
});

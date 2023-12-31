document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    // Define the OpenStreetMap and Satellite layers
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
        attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
    });

    // Create a layer group for GeoJSON layers and add it to the map
    var geojsonGroup = L.layerGroup().addTo(mymap);

    // Function to add GeoJSON data to the map with mouseover event for country names
    function addGeoJSONToGroup(url, style) {
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
                                className: 'country-tooltip'
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

    // Add GeoJSON layers to the map
    addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', {
        color: 'white',
        weight: 0.5,
        fillColor: 'black',
        fillOpacity: 1
    });

    // Function to toggle layers
    function toggleLayer(layer) {
        if (mymap.hasLayer(layer)) {
            mymap.removeLayer(layer);
        } else {
            mymap.addLayer(layer);
        }
    }

    // Functions to toggle specific layers
    window.toggleOSMLayer = function() { toggleLayer(osmLayer); };
    window.toggleSatelliteLayer = function() { toggleLayer(satelliteLayer); };
    window.toggleGeoJSONLayer = function() { toggleLayer(geojsonGroup); };

    // Initialize the geocoder
    var geocoder = new L.Control.Geocoder.Nominatim();

    // Event listener for the custom search button
    var searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            var query = document.getElementById('search-input').value;
            geocoder.geocode(query, function(results) {
                if (results.length > 0) {
                    var bbox = results[0].

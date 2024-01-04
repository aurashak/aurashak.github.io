document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map with options
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    // Define the OpenStreetMap and satellite layers
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' });
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', { attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020' });

    // Create a layer group for GeoJSON layers and add it to the map
    var geojsonGroup = L.layerGroup().addTo(mymap);

    // Function to add GeoJSON data to the map
    function addGeoJSONToGroup(url, style) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: style,
                    onEachFeature: function (feature, layer) {
                        var tooltipContent = feature.properties.name || feature.properties.ADMIN;
                        layer.bindTooltip(tooltipContent, { permanent: false, direction: 'auto', className: 'geojson-tooltip', sticky: true }).openTooltip();
                    }
                }).addTo(geojsonGroup);
            });
    }

    // Add GeoJSON layers to the map
    addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', { color: 'white', weight: 0.5, fillColor: 'black', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/lakes.geojson', { color: 'lightblue', weight: 0.1, fillColor: 'lightblue', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/rivers.geojson', { color: 'lightblue', weight: 0.1, fillColor: 'lightblue', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/oceans.geojson', { color: 'lightblue', weight: 0.1, fillColor: 'lightblue', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', { color: 'green', weight: 0.1, fillColor: 'green', fillOpacity: 0.25 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/projectmarkers.geojson', { color: 'red', weight: 0.5, fillColor: 'red', fillOpacity: 1 });

    // Add graticule to the map
    if (typeof L.graticule === "function") {
        L.graticule({
            interval: 20,
            style: { color: '#333', weight: 1 }
        }).addTo(mymap);
    } else {
        console.error("L.graticule is not defined. Ensure the leaflet-graticule script is loaded.");
    }

    // Add the dynamic scale bar to the map
    L.control.scale({
        imperial: false,
        metric: true,
        updateWhenIdle: false
    }).addTo(mymap);

    // Function to switch layers
    function switchLayer(layer) {
        if (mymap.currentLayer) {
            mymap.removeLayer(mymap.currentLayer);
        }
        mymap.addLayer(layer);
        mymap.currentLayer = layer;
    }

    // Set the initial layer to the OpenStreetMap layer
    mymap.currentLayer = osmLayer;
    mymap.addLayer(osmLayer);

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

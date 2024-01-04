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
    
    // Layer groups for each type of feature
    var countriesLayerGroup = L.layerGroup().addTo(mymap);
    var lakesLayerGroup = L.layerGroup().addTo(mymap);
    var riversLayerGroup = L.layerGroup().addTo(mymap);
    var regionsLayerGroup = L.layerGroup().addTo(mymap);
    var oceansLayerGroup = L.layerGroup().addTo(mymap);
    var projectMarkersLayerGroup = L.layerGroup().addTo(mymap);

    // Function to add GeoJSON data to the map
    function addGeoJSONToGroup(url, style, layerGroup) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                var geoJsonLayer = L.geoJSON(data, {
                    style: style,
                    onEachFeature: function (feature, layer) {
                        layer.on({
                            mouseover: function(e) {
                                var tooltipContent = feature.properties.name || feature.properties.ADMIN;
                                layer.bindTooltip(tooltipContent, {
                                    permanent: false,
                                    direction: 'auto',
                                    className: 'geojson-tooltip',
                                    sticky: true
                                }).openTooltip();
                            }
                        });
                    }
                });
                geoJsonLayer.addTo(layerGroup);
            });
    }

    // Add GeoJSON layers to their respective layer groups
    addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', { color: 'grey', weight: 0.5, fillColor: 'black', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/lakes.json', { color: 'white', weight: 0.1, fillColor: 'white', fillOpacity: 1 }, (layer) => { lakesLayer = layer; bringToFront(); });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/rivers.geojson', { color: 'white', weight: 0.25, fillColor: 'white', fillOpacity: 1 }, (layer) => { riversLayer = layer; bringToFront(); });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/oceans.geojson', { color: 'white', weight: 0.5, fillColor: 'white', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', { color: 'green', weight: 0.1, fillColor: 'green', fillOpacity: 0.01, opacity: 0.01 }, (layer) => { regionsLayer = layer; bringToFront(); });    
    addGeoJSONToGroup('https://aurashak.github.io/geojson/projectmarkers.geojson', { color: 'red', weight: 0.5, fillColor: 'red', fillOpacity: 1 });

    // Add the scale bar to the map
    L.control.scale({
        imperial: false,
        metric: true,
        updateWhenIdle: false
    }).addTo(mymap);

    // Functions to switch between layers
    function clearAllLayers() {
        // Remove all layers from the map
        countriesLayerGroup.clearLayers();
        lakesLayerGroup.clearLayers();
        riversLayerGroup.clearLayers();
        regionsLayerGroup.clearLayers();
        oceansLayerGroup.clearLayers();
        projectMarkersLayerGroup.clearLayers();
    }

    window.toggleOSMLayer = function() {
        clearAllLayers();
        mymap.addLayer(osmLayer);
    };

    window.toggleSatelliteLayer = function() {
        clearAllLayers();
        mymap.addLayer(satelliteLayer);
    };

    window.toggleGeoJSONLayer = function() {
        clearAllLayers();
        // Add the GeoJSON layers back to their respective layer groups
        addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', { color: 'grey', weight: 0.5, fillColor: 'black', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/lakes.json', { color: 'white', weight: 0.1, fillColor: 'white', fillOpacity: 1 }, (layer) => { lakesLayer = layer; bringToFront(); });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/rivers.geojson', { color: 'white', weight: 0.25, fillColor: 'white', fillOpacity: 1 }, (layer) => { riversLayer = layer; bringToFront(); });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/oceans.geojson', { color: 'white', weight: 0.5, fillColor: 'white', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', { color: 'green', weight: 0.1, fillColor: 'green', fillOpacity: 0.01, opacity: 0.01 }, (layer) => { regionsLayer = layer; bringToFront(); });    
    addGeoJSONToGroup('https://aurashak.github.io/geojson/projectmarkers.geojson', { color: 'red', weight: 0.5, fillColor: 'red', fillOpacity: 1 });


    // Initial layer visibility
    toggleGeoJSONLayer(); // Start with GeoJSON layers visible

    // Add the search control to the map
    var searchControl = new L.Control.geocoder({
        placeholder: "Search for a place",
        geocoder: new L.Control.Geocoder.Nominatim()
    }).addTo(mymap);

    // Search button event listener
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







    
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map with options
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    // Define layers
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' });
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', { attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020' });
    var geojsonGroup = L.layerGroup().addTo(mymap);

    // Global variables for GeoJSON layers
    var riversLayer, lakesLayer, regionsLayer;

// Function to add GeoJSON data to the map
function addGeoJSONToGroup(url, style, assignLayer) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var layer = L.geoJSON(data, {
                style: style,
                onEachFeature: function (feature, layer) {
                    // Bind a generic tooltip that will be updated dynamically
                    layer.bindTooltip('', {
                        permanent: false,
                        direction: 'auto',
                        className: 'geojson-tooltip',
                        sticky: true
                    });

                    // Update tooltip content on mouseover
                    layer.on('mouseover', function (e) {
                        var lat = e.latlng.lat.toFixed(5);
                        var lng = e.latlng.lng.toFixed(5);
                        var placeName = feature.properties.name || feature.properties.ADMIN || '';
                        var tooltipContent = `<strong>${placeName}</strong><br>Lat: ${lat}, Lng: ${lng}`;
                        this.setTooltipContent(tooltipContent);
                    });

                    // Close tooltip on mouseout
                    layer.on('mouseout', function () {
                        this.closeTooltip();
                    });
                }
            }).addTo(geojsonGroup);

            if (assignLayer) {
                assignLayer(layer);
                layer.bringToFront();
            }
        });
}



    // Add GeoJSON layers to the map
    addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', { color: 'grey', weight: 0.4, fillColor: 'black', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/lakes.json', { color: 'white', weight: 0.1, fillColor: 'white', fillOpacity: 1 }, (layer) => { lakesLayer = layer; });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/rivers.geojson', { color: 'white', weight: 0.1, fillColor: 'white', fillOpacity: 1 }, (layer) => { riversLayer = layer; });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/oceans.geojson', { color: 'white', weight: 0.1, fillColor: 'white', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', { color: 'green', weight: 0.1, fillColor: 'green', fillOpacity: 0.01 }, (layer) => { regionsLayer = layer; });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/projectmarkers.geojson', { color: 'red', weight: 0.5, fillColor: 'red', fillOpacity: 1 });

    // Add the dynamic scale bar to the map
    L.control.scale({ imperial: false, metric: true, updateWhenIdle: false }).addTo(mymap);

    // Function to switch layers
    function switchLayer(layer) {
        if (mymap.currentLayer) {
            mymap.removeLayer(mymap.currentLayer);
        }
        mymap.addLayer(layer);
        mymap.currentLayer = layer;

        if (lakesLayer) lakesLayer.bringToFront();
        if (riversLayer) riversLayer.bringToFront();
        if (regionsLayer) regionsLayer.bringToFront();
    }

    // Set initial layer
    mymap.currentLayer = geojsonGroup;

    // Button functions to switch between layers
    window.toggleOSMLayer = function() { switchLayer(osmLayer); }
    window.toggleSatelliteLayer = function() { switchLayer(satelliteLayer); }
    window.toggleGeoJSONLayer = function() { switchLayer(geojsonGroup); }

    // Add the search control
    var searchControl = new L.Control.geocoder({ placeholder: "Search for a place", geocoder: new L.Control.Geocoder.Nominatim() }).addTo(mymap);

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

document.addEventListener('DOMContentLoaded', function() {
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' });
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', { attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020' });

    var geojsonGroup = L.layerGroup().addTo(mymap);

    var lakesLayer, riversLayer, regionsLayer;

    function addGeoJSONToGroup(url, layerGroup) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                var geoJsonLayer = L.geoJSON(data, {
                    pointToLayer: function(feature, latlng) {
                        var markerOptions = {
                            radius: 8,
                            fillColor: '#ff7800', // default color
                            color: '#000',
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        };
                        
                        if (feature.properties && feature.properties.classification) {
                            switch (feature.properties.classification) {
                                case 'writing':
                                    markerOptions.fillColor = 'blue';
                                    break;
                                case 'sculptures':
                                    markerOptions.fillColor = 'red';
                                    break;
                                case 'print':
                                    markerOptions.fillColor = 'green';
                                    break;
                                case 'web':
                                    markerOptions.fillColor = 'purple';
                                    break;
                                // Add more cases as necessary
                            }
                        }
                        
                        return L.circleMarker(latlng, markerOptions);
                    },
                    onEachFeature: function (feature, layer) {
                        // ... existing tooltip setup remains unchanged
                    }
                }).addTo(layerGroup);
            });
    }
    
    // Then, when adding the project markers layer, specify the classification property you want to check
    addGeoJSONToGroup('https://aurashak.github.io/geojson/projectmarkers.geojson', projectMarkersLayerGroup);
    


    function bringToFront() {
        if (lakesLayer) lakesLayer.bringToFront();
        if (riversLayer) riversLayer.bringToFront();
        if (regionsLayer) regionsLayer.bringToFront();
    }

    addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', { color: 'grey', weight: 0.5, fillColor: 'black', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/lakes.json', { color: 'white', weight: 0.1, fillColor: 'white', fillOpacity: 1 }, (layer) => { lakesLayer = layer; bringToFront(); });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/rivers.geojson', { color: 'white', weight: 0.25, fillColor: 'white', fillOpacity: 1 }, (layer) => { riversLayer = layer; bringToFront(); });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/oceans.geojson', { color: 'white', weight: 0.5, fillColor: 'white', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', { color: 'green', weight: 0.1, fillColor: 'green', fillOpacity: 0.01, opacity: 0.01 }, (layer) => { regionsLayer = layer; bringToFront(); });    
    addGeoJSONToGroup('https://aurashak.github.io/geojson/projectmarkers.geojson', { color: 'red', weight: 0.5, fillColor: 'red', fillOpacity: 1 });

    L.control.scale({ imperial: false, metric: true, updateWhenIdle: false }).addTo(mymap);

    function switchLayer(layer) {
        if (mymap.hasLayer(mymap.currentLayer)) {
            mymap.removeLayer(mymap.currentLayer);
        }
        mymap.addLayer(layer);
        mymap.currentLayer = layer;
        bringToFront();
    }

    mymap.currentLayer = geojsonGroup;
    switchLayer(geojsonGroup);  // Make GeoJSON group the default visible layer

    window.toggleOSMLayer = function() { switchLayer(osmLayer); }
    window.toggleSatelliteLayer = function() { switchLayer(satelliteLayer); }
    window.toggleGeoJSONLayer = function() { switchLayer(geojsonGroup); }

    var searchControl = new L.Control.geocoder({ placeholder: "Search for a place", geocoder: new L.Control.Geocoder.Nominatim() }).addTo(mymap);

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

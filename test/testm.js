document.addEventListener('DOMContentLoaded', function() {
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    // Tile Layers
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(mymap);
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', { attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020' });

    // Marker Icons
    var redIcon = L.icon({ iconUrl: 'path/to/redIcon.png', ... }); // Define other icon properties
    var greenIcon = L.icon({ iconUrl: 'path/to/greenIcon.png', ... });
    var blackIcon = L.icon({ iconUrl: 'path/to/blackIcon.png', ... });
    var yellowIcon = L.icon({ iconUrl: 'path/to/yellowIcon.png', ... });

    // Style Functions
    function countriesStyle(feature) { /* ... */ }
    function oceanStyle(feature) { /* ... */ }
    function lakesStyle(feature) { /* ... */ }
    function riversStyle(feature) { /* ... */ }
    function regionsStyle(feature) { /* ... */ }

    // Feature Interaction
    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
        }
    }

    // Adding GeoJSON Layers
    function addGeoJSONLayer(url, styleFunc, iconFunc) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: styleFunc,
                    pointToLayer: function(feature, latlng) {
                        return L.marker(latlng, { icon: iconFunc(feature) });
                    },
                    onEachFeature: onEachFeature
                }).addTo(mymap);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    }

    // Icon Selector Function
    function selectIcon(feature) {
        switch (feature.properties['marker-color']) {
            case 'red': return redIcon;
            case 'green': return greenIcon;
            case 'black': return blackIcon;
            case 'yellow': return yellowIcon;
            default: return defaultIcon;
        }
    }

    // Adding Layers
    addGeoJSONLayer('https://aurashak.github.io/geojson/countries.geojson', countriesStyle, selectIcon);
    addGeoJSONLayer('https://aurashak.github.io/geojson/oceans.geojson', oceanStyle, selectIcon);
    addGeoJSONLayer('https://aurashak.github.io/geojson/lakes.json', lakesStyle, selectIcon);
    addGeoJSONLayer('https://aurashak.github.io/geojson/rivers.geojson', riversStyle, selectIcon);
    addGeoJSONLayer('https://aurashak.github.io/geojson/regions.geojson', regionsStyle, selectIcon);
    addGeoJSONLayer('https://aurashak.github.io/geojson/projectmarkers.geojson', null, selectIcon); // No style function for markers

    // Layer Switching Functions
    window.toggleOSMLayer = function() { switchLayer(osmLayer); };
    window.toggleSatelliteLayer = function() { switchLayer(satelliteLayer); };

    // Search Control
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

function switchLayer(layer) {
    if (mymap.hasLayer(mymap.currentLayer)) {
        mymap.removeLayer(mymap.currentLayer);
    }
    mymap.addLayer(layer);
    mymap.currentLayer = layer;
}

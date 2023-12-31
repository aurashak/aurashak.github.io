var mymap = L.map('mapid', {
    minZoom: 2,
    maxZoom: 7,
}).setView([0, 0], 3);

// Define tile layers
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
    attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
});

// Add the GeoJSON group to the map initially
var geojsonGroup = L.layerGroup().addTo(mymap);

// Function to add GeoJSON data to the group
function addGeoJSONToGroup(url, style) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, { 
                style: style,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        layer.bindPopup(feature.properties.name);
                    }
                }
            }).addTo(geojsonGroup);
        });
}

addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', {
    color: 'white',
    weight: 0.5,
    fillColor: 'black',
    fillOpacity: 1
});

// Add graticule (lat/long lines)
L.graticule({
    interval: 20
}).addTo(mymap);

// Toggle layer functions
function toggleLayer(layer, otherLayers) {
    if (mymap.hasLayer(layer)) {
        mymap.removeLayer(layer);
    } else {
        mymap.addLayer(layer);
        otherLayers.forEach(l => mymap.removeLayer(l));
    }
}

function toggleOSMLayer() {
    toggleLayer(osmLayer, [satelliteLayer, geojsonGroup]);
}

function toggleSatelliteLayer() {
    toggleLayer(satelliteLayer, [osmLayer, geojsonGroup]);
}

function toggleGeoJSONLayer() {
    toggleLayer(geojsonGroup, [osmLayer, satelliteLayer]);
}

// Add markers for specific cities
var luanda = L.marker([-8.83833, 13.23444]).bindPopup('Luanda');
var cartagena = L.marker([10.391049, -75.479426]).bindPopup('Cartagena');
var stockholm = L.marker([59.329323, 18.068581]).bindPopup('Stockholm');

luanda.addTo(mymap);
cartagena.addTo(mymap);
stockholm.addTo(mymap);

// Add the search control to the map
var searchControl = new L.Control.geocoder({
    placeholder: "Search for a place",
    geocoder: new L.Control.Geocoder.Nominatim()
}).addTo(mymap);

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', function() {
    var query = document.getElementById('search-input').value;
    L.Control.Geocoder.nominatim().geocode(query, function(results) {
        if (results.length > 0) {
            var bbox = results[0].bbox;
            mymap.fitBounds([
                [bbox[1], bbox[0]],
                [bbox[3], bbox[2]]
            ]);
        } else {
            alert('Location not found');
        }
    });
});

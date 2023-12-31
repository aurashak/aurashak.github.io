// Initialize the map on the 'mapid' div with a given center and zoom level.
// Set minimum and maximum zoom levels to control zoom behavior.
var mymap = L.map('mapid', {
    minZoom: 2,
    maxZoom: 7,
}).setView([0, 0], 3);

// Define the OpenStreetMap layer and add it to the map.
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

// Define a satellite imagery layer.
var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
    attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
});

// Create a layer group for GeoJSON data and add it to the map.
var geojsonGroup = L.layerGroup().addTo(mymap);

// Function to load and add GeoJSON data to the geojsonGroup layer.
function addGeoJSONToGroup(url, style) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, { style: style }).addTo(geojsonGroup);
        });
}

// Load and style GeoJSON data for countries, lakes, and rivers.
addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', {
    color: 'white',
    weight: 0.5,
    fillColor: 'black',
    fillOpacity: 1
});

// Add a graticule (a network of latitude and longitude lines) to the map.
L.graticule({
    interval: 20
}).addTo(mymap);

// Functions to toggle different layers on the map.
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

// Add a geocoding search control to the map using Nominatim service.
var searchControl = new L.Control.geocoder({
    placeholder: "Search for a place",
    geocoder: new L.Control.Geocoder.Nominatim()
}).addTo(mymap);

// Event listener for the custom search button.
// Performs geocoding and zooms to the result location.
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

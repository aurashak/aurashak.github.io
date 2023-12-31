var mymap = L.map('mapid').setView([0, 0], 3);

// Define tile layers
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});
var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
    attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
});

var searchControl = new L.Control.geocoder({
    placeholder: "Search for a place", // Placeholder text for the search box
    geocoder: new L.Control.Geocoder.Nominatim() // Using Nominatim geocoder by default
}).addTo(mymap);

var geojsonGroup = L.layerGroup().addTo(mymap); // Add the GeoJSON group to the map initially

// Function to add GeoJSON data to the group
function addGeoJSONToGroup(url, style) {
    return fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            L.geoJSON(data, { style }).addTo(geojsonGroup);
        });
}

// Add countries, lakes, and rivers layers to the group sequentially
addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', {
    color: 'white',
    weight: .5,
    fillColor: 'black',
    fillOpacity: 1
}).then(function() {
    return addGeoJSONToGroup('https://aurashak.github.io/geojson/ne_10m_lakes.json', {
        color: 'white',
        weight: 0,
        fillColor: 'white',
        fillOpacity: 1
    });
}).then(function() {
    return addGeoJSONToGroup('https://aurashak.github.io/geojson/earth-rivers.geo.json', {
        color: 'white',
        weight: 0.03,
        fillOpacity: 1
    });
}).catch(function(error) {
    console.log('Error: ' + error);
});

// Toggle functions
function toggleOSMLayer() {
    toggleLayer(osmLayer, [satelliteLayer, geojsonGroup]);
}

function toggleSatelliteLayer() {
    toggleLayer(satelliteLayer, [osmLayer, geojsonGroup]);
}

function toggleGeoJSONLayer() {
    toggleLayer(geojsonGroup, [osmLayer, satelliteLayer]);
}

function toggleLayer(layer, otherLayers) {
    if (mymap.hasLayer(layer)) {
        mymap.removeLayer(layer);
    } else {
        mymap.addLayer(layer);
        otherLayers.forEach(l => mymap.removeLayer(l));
    }
}

// No need to add OSM or Satellite layers initially



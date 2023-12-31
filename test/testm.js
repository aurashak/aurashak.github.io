var mymap = L.map('mapid').setView([0, 0], 3);

// Define tile layers
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap); // The OSM layer is added to the map by default

var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
    attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
});

// Add the GeoJSON group to the map initially
var geojsonGroup = L.layerGroup().addTo(mymap);

// Function to add GeoJSON data to the group
function addGeoJSONToGroup(url, style) {
    return fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            L.geoJSON(data, { style: style }).addTo(geojsonGroup);
        });
}

// Add countries, lakes, and rivers layers to the group
addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', {
    color: 'white',
    weight: 0.5,
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
    console.error('Error loading GeoJSON data:', error);
});

// Toggle layer functions
function toggleLayer(layer, otherLayers) {
    if (mymap.hasLayer(layer)) {
        mymap.removeLayer(layer);
    } else {
        mymap.addLayer(layer);
        otherLayers.forEach(function(l) {
            mymap.removeLayer(l);
        });
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

// Initialize the Leaflet geocoder control and add it to the map
var searchControl = L.Control.geocoder({
    placeholder: "Search for a place",
    defaultMarkGeocode: false
}).on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
         bbox.getSouthEast(),
         bbox.getNorthEast(),
         bbox.getNorthWest(),
         bbox.getSouthWest()
    ]).addTo(mymap);
    mymap.fitBounds(poly.getBounds());
}).addTo(mymap);

var mymap = L.map('mapid').setView([0, 0], 3);

// Define layers
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});
var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri and others'
});
// Define Copernicus (Sentinel) satellite tile layer
var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
    attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
});
var geojsonLayer;

// Initially add only the GeoJSON layer
fetch('https://aurashak.github.io/geojson/countries.geojson')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        geojsonLayer = L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: 'white',
                    weight: 2,
                    fillColor: 'black',
                    fillOpacity: 1
                };
            }
        }).addTo(mymap);
    })
    .catch(function(error) {
        console.log('Error: ' + error);
    });

// Toggle functions
function toggleOSMLayer() {
    if (mymap.hasLayer(osmLayer)) {
        mymap.removeLayer(osmLayer);
    } else {
        mymap.addLayer(osmLayer);
        mymap.removeLayer(satelliteLayer);
        mymap.removeLayer(geojsonLayer);
    }
}

function toggleSatelliteLayer() {
    if (mymap.hasLayer(satelliteLayer)) {
        mymap.removeLayer(satelliteLayer);
    } else {
        mymap.addLayer(satelliteLayer);
        mymap.removeLayer(osmLayer);
        mymap.removeLayer(geojsonLayer);
    }
}

function toggleGeoJSONLayer() {
    if (mymap.hasLayer(geojsonLayer)) {
        mymap.removeLayer(geojsonLayer);
    } else {
        mymap.addLayer(geojsonLayer);
        mymap.removeLayer(osmLayer);
        mymap.removeLayer(satelliteLayer);
    }
}

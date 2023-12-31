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

// GeoJSON layer
var geojsonLayer = L.geoJSON(null, {
    style: function(feature) {
        return {color: 'white', weight: 0.5, fillColor: 'black', fillOpacity: 1};
    },
    onEachFeature: function(feature, layer) {
        layer.on('mouseover', function() {
            layer.bindTooltip(feature.properties.NAME, {permanent: true, direction: 'center'}).openTooltip();
        });
        layer.on('mouseout', function() {
            layer.unbindTooltip();
        });
    }
}).addTo(mymap);

// Add GeoJSON data
fetch('https://aurashak.github.io/geojson/countries.geojson')
    .then(response => response.json())
    .then(data => {
        geojsonLayer.addData(data);
    });

// Graticule
L.graticule({
    interval: 20
}).addTo(mymap);

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
    toggleLayer(osmLayer, [satelliteLayer, geojsonLayer]);
}

function toggleSatelliteLayer() {
    toggleLayer(satelliteLayer, [osmLayer, geojsonLayer]);
}

function toggleGeoJSONLayer() {
    toggleLayer(geojsonLayer, [osmLayer, satelliteLayer]);
}

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

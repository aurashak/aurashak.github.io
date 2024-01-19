var map = L.map('map').setView([40.7128, -74.0060], 10); // New York City coordinates

L.control.scale().addTo(map);

// Load and add the NYC GeoJSON layer
var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg', {
    style: function (feature) {
        return {};
    }
});

var openstreetmapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    style: function (feature) {
        return {};
    }
});

// Create a layer group for base layers including "Satellite" and "OpenStreetMap"
var baseLayers = {
    "OpenStreetMap": openstreetmapLayer,
    "Satellite": satelliteLayer,
    "Off": L.layerGroup([]) // Create an empty layer group for "Turn Off"
};

// Create a layer control with baseLayers
var layerControl = L.control.layers(baseLayers, null, {
    position: 'topright' // Position the control in the top right corner
}).addTo(map);

// Set OpenStreetMap as the default base layer
openstreetmapLayer.addTo(map);

function calculateMarkerSize(zoom) {
    // Define the initial and minimum sizes
    var initialSize = 8;
    var minSize = 3;

    // Calculate the size based on zoom level with a minimum size
    var size = initialSize - (zoom - 5) * 5;
    return Math.max(size, minSize);
}

// Air group
var aqisiteLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/aqisite.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.marker(latlng, {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: '🌬️', // Emoji for air quality site
                iconSize: [size, size]
            })
        });
    }
}).addTo(map);

document.getElementById('aqisite').addEventListener('click', function() {
    if (map.hasLayer(aqisiteLayer)) {
        map.removeLayer(aqisiteLayer);
    } else {
        map.addLayer(aqisiteLayer);
    }
});

// Energy group
var majoroilstorageLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/majoroilstorage.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.marker(latlng, {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: '🛢️', // Emoji for major oil storage
                iconSize: [size, size]
            })
        });
    }
}).addTo(map);

document.getElementById('majoroilstorage').addEventListener('click', function() {
    if (map hasLayer(majoroilstorageLayer)) {
        map.removeLayer(majoroilstorageLayer);
    } else {
        map.addLayer(majoroilstorageLayer);
    }
});

// Repeat the above code for other layers, changing the emoji accordingly
// For example, '⚡' for powerplants, '🗑️' for waste transfer facility, etc.


// Set the legend symbol colors and emojis for each layer
setLegendSymbol('airpollution', 'green', '🌬️'); // Emoji for air quality site
setLegendSymbol('aqisite', 'white', '🌬️'); // Emoji for air quality site
setLegendSymbol('chemicalstorage', 'blue', '🧪'); // Emoji for chemical storage
setLegendSymbol('recyclingfacility', 'orange', '♻️'); // Emoji for recycling facility
setLegendSymbol('nycso', 'brown', '🚔'); // Emoji for NYC Special Operations
setLegendSymbol('nygaspipelines', 'purple', '🔍'); // Emoji for gas pipelines
setLegendSymbol('powerplants', '#013220', '⚡'); // Emoji for power plants
setLegendSymbol('wastewatertreatment', 'red', '🌊'); // Emoji for wastewater treatment
setLegendSymbol('wastetransferfacility', 'purple', '🗑️'); // Emoji for waste transfer facility
setLegendSymbol('majoroilstorage', 'black', '🛢️'); // Emoji for major oil storage
setLegendSymbol('floodplain', '#ADD8E6', '🌊'); // Emoji for floodplain

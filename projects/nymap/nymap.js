var map = L.map('map').setView([40.7128, -74.0060], 10); // New York City coordinates

L.control.scale().addTo(map);

function calculateMarkerSize(zoom) {
    // Define the initial and minimum sizes
    var initialSize = 10;
    var minSize = 5;

    // Calculate the size based on zoom level with a minimum size
    var size = initialSize - (zoom - 10) * 5;
    return Math.max(size, minSize);
}

var nyccountiesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nyccounties.geojson', {
    style: function (feature) {
        return {
            fillColor: 'black',
            color: 'black',
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: 0
        };
    }
}).addTo(map);

var floodplainLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson', {
    style: function (feature) {
        return {
            fillColor: '#ADD8E6',
            color: 'black',
            weight: 0,
            opacity: 0,
            fillOpacity: 0.8
        };
    }
}).addTo(map);

var nycsoLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycso.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'brown',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(map);

var powerplantsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycpowerplants.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'gold',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
});


var nygaspipelinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson', {
    style: function (feature) {
        var size = calculateMarkerSize(map.getZoom());
        return {
            color: 'purple',
            weight: 5,
            opacity: 0.6
        };
    }
});

// Create a layer group containing powerplantsLayer and nygaspipelinesLayer
var powerplantsandpipelinesGroup = L.layerGroup([powerplantsLayer, nygaspipelinesLayer]);

// Add the combined group to the map
powerplantsandpipelinesGroup.addTo(map);

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



// Sample air pollution data as LatLng objects
var airPollutionData = [
    new google.maps.LatLng(40.7128, -74.0060), // Example data point
    // Add more data points as needed
];

// Create a heatmap layer
var heatmap = new google.maps.visualization.HeatmapLayer({
    data: airPollutionData,
    map: map
});

// Event listener for toggling the heatmap layer
document.getElementById('airpollution').addEventListener('click', function() {
    if (heatmap.getMap()) {
        heatmap.setMap(null); // Remove the heatmap layer from the map
    } else {
        heatmap.setMap(map); // Add the heatmap layer to the map
    }
});

// Define air pollution layer
var airpollutionLayer = heatmap;

document.getElementById('floodplain').addEventListener('click', function() {
    if (map.hasLayer(floodplainLayer)) {
        map.removeLayer(floodplainLayer);
    } else {
        map.addLayer(floodplainLayer);
    }
});

// Event listener for layer toggling
document.getElementById('powerplantsandpipelines').addEventListener('click', function() {
    if (map.hasLayer(powerplantsandpipelinesGroup)) {
        map.removeLayer(powerplantsandpipelinesGroup);
    } else {
        map.addLayer(powerplantsandpipelinesGroup);
    }
});

document.getElementById('nycso').addEventListener('click', function() {
    if (map.hasLayer(nycsoLayer)) {
        map.removeLayer(nycsoLayer);
    } else {
        map.addLayer(nycsoLayer);
    }
});

document.getElementById('openstreetmap').addEventListener('click', function() {
    if (map.hasLayer(openstreetmapLayer)) {
        map.removeLayer(openstreetmapLayer);
    } else {
        map.addLayer(openstreetmapLayer);
    }
});

document.getElementById('satellite').addEventListener('click', function() {
    if (map.hasLayer(satelliteLayer)) {
        map.removeLayer(satelliteLayer);
    } else {
        map.addLayer(satelliteLayer);
    }
});

document.getElementById('airpollution').addEventListener('click', function() {
    if (map.hasLayer(airpollutionLayer)) {
        map.removeLayer(airpollutionLayer);
    } else {
        map.addLayer(airpollutionLayer);
    }
});



 


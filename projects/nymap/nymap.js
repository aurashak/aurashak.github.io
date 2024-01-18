// Create the map
var map = L.map('map').setView([40.7128, -74.0060], 10); // New York City coordinates

L.control.scale().addTo(map);

// Define a function to calculate marker size based on zoom level
function calculateMarkerSize(zoom) {
    var initialSize = 10;
    var minSize = 5;
    var size = initialSize - (zoom - 10) * 5;
    return Math.max(size, minSize);
}

// Define layers with AJAX requests
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
});

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
});

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
});

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

// Define base layers
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

// Create a layer group for base layers
var baseLayers = {
    "OpenStreetMap": openstreetmapLayer,
    "Satellite": satelliteLayer
};

// Define overlays including the air pollution layer
var overlayLayers = {
    "NYC Counties": nyccountiesLayer,
    "Floodplain": floodplainLayer,
    "NYC SO": nycsoLayer,
    "Power Plants and Pipelines": powerplantsandpipelinesGroup,
    "Air Pollution": heatLayer // Add the air pollution layer here
};

var layerControl = L.control.layers(baseLayers, overlayLayers, {
    position: 'topright'
}).addTo(map);


// Set OpenStreetMap as the default base layer
openstreetmapLayer.addTo(map);

// Sample air pollution data as LatLng objects
var airpollutionData = [
    [40.7128, -74.0060], // Example data point
    // Add more data points as needed
];

// Create a heatmap layer
var heatLayer = L.heatLayer(airpollutionData, { radius: 20 });

// Event listener for toggling the heatmap layer
document.getElementById('airpollution').addEventListener('click', function () {
    if (map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer); // Remove the heatmap layer from the map
    } else {
        map.addLayer(heatLayer); // Add the heatmap layer to the map
    }
});

// Event listeners for toggling other layers
document.getElementById('floodplain').addEventListener('click', function () {
    toggleLayer(floodplainLayer);
});

document.getElementById('powerplantsandpipelines').addEventListener('click', function () {
    toggleLayer(powerplantsandpipelinesGroup);
});

document.getElementById('nycso').addEventListener('click', function () {
    toggleLayer(nycsoLayer);
});

// Function to toggle layers
function toggleLayer(layer) {
    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    } else {
        map.addLayer(layer);
    }
}

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

// Water layer

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

document.getElementById('floodplain').addEventListener('click', function() {
    if (map.hasLayer(floodplainLayer)) {
        map.removeLayer(floodplainLayer);
    } else {
        map.addLayer(floodplainLayer);
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
}).addTo(map);

document.getElementById('nycso').addEventListener('click', function() {
    if (map.hasLayer(nycsoLayer)) {
        map.removeLayer(nycsoLayer);
    } else {
        map.addLayer(nycsoLayer);
    }
});

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
    if (map.hasLayer(majoroilstorageLayer)) {
        map.removeLayer(majoroilstorageLayer);
    } else {
        map.addLayer(majoroilstorageLayer);
    }
});

var powerplantsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycpowerplants.geojson', {
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

document.getElementById('powerplants').addEventListener('click', function() {
    if (map.hasLayer(powerplantsLayer)) {
        map.removeLayer(powerplantsLayer);
    } else {
        map.addLayer(powerplantsLayer);
    }
});

var nygaspipelinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson', {
    style: function (feature) {
        var size = calculateMarkerSize(map.getZoom());
        return {
            color: 'purple',
            weight: 3,
            opacity: 0.6
        };
    }
}).addTo(map);

document.getElementById('nygaspipelines').addEventListener('click', function() {
    if (map.hasLayer(nygaspipelinesLayer)) {
        map.removeLayer(nygaspipelinesLayer);
    } else {
        map.addLayer(nygaspipelinesLayer);
    }
});

// Waste group

var wastetransferfacilityLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/wastetransferfacility.geojson', {
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

document.getElementById('wastetransferfacility').addEventListener('click', function() {
    if (map.hasLayer(wastetransferfacilityLayer)) {
        map.removeLayer(wastetransferfacilityLayer);
    } else {
        map.addLayer(wastetransferfacilityLayer);
    }
});

var wastewatertreatmentLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/wastewatertreatment.geojson', {
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

document.getElementById('wastewatertreatment').addEventListener('click', function() {
    if (map.hasLayer(wastewatertreatmentLayer)) {
        map.removeLayer(wastewatertreatmentLayer);
    } else {
        map.addLayer(wastewatertreatmentLayer);
    }
});

var inactivesolidwastelandfillLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/inactivesolidwastelandfill.geojson', {
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

document.getElementById('inactivesolidwastelandfill').addEventListener('click', function() {
    if (map.hasLayer(inactivesolidwastelandfillLayer)) {
        map.removeLayer(inactivesolidwastelandfillLayer);
    } else {
        map.addLayer(inactivesolidwastelandfillLayer);
    }
});

var recyclingfacilityLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/recyclingfacility.geojson', {
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

document.getElementById('recyclingfacility').addEventListener('click', function() {
    if (map.hasLayer(recyclingfacilityLayer)) {
        map.removeLayer(recyclingfacilityLayer);
    } else {
        map.addLayer(recyclingfacilityLayer);
    }
});

// Other

var chemicalstorageLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/chemicalstorage.geojson', {
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

document.getElementById('chemicalstorage').addEventListener('click', function() {
    if (map.hasLayer(chemicalstorageLayer)) {
        map.removeLayer(chemicalstorageLayer);
    } else {
        map.addLayer(chemicalstorageLayer);
    }
});

// Define a function to set the legend symbol color and emoji
function setLegendSymbol(layerId, color, emoji) {
    const legendSymbol = document.getElementById(`legend-${layerId}`);
    if (legendSymbol) {
        legendSymbol.style.backgroundColor = color;
        legendSymbol.innerHTML = emoji; // Set emoji as inner HTML
    }
}

// Set the legend symbol colors and emojis for each layer
setLegendSymbol('airpollution', 'green', '🌬️'); // Emoji for air quality site
setLegendSymbol('aqisite', 'white', '☁️'); // Emoji for air quality site
setLegendSymbol('chemicalstorage', 'blue', '🧪'); // Emoji for chemical storage
setLegendSymbol('recyclingfacility', 'orange', '♻️'); // Emoji for recycling facility
setLegendSymbol('nycso', 'brown', '🚽'); // Emoji for NYC Special Operations
setLegendSymbol('nygaspipelines', 'purple', '🔍'); // Emoji for gas pipelines
setLegendSymbol('powerplants', '#013220', '⚡'); // Emoji for power plants
setLegendSymbol('wastewatertreatment', 'red', '🚾'); // Emoji for wastewater treatment
setLegendSymbol('wastetransferfacility', 'purple', '🗑️'); // Emoji for waste transfer facility
setLegendSymbol('majoroilstorage', 'black', '🛢️'); // Emoji for major oil storage
setLegendSymbol('floodplain', '#ADD8E6', '🌊'); // Emoji for floodplain













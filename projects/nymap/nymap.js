// Define the bounding box for the NYC tri-state area
var southWest = L.latLng(40.4774, -74.2591); // Southwest coordinates (lower-left)
var northEast = L.latLng(41.3241, -73.2277); // Northeast coordinates (upper-right)
var bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0, // Restrict dragging outside bounds smoothly
}).setView([40.7128, -74.0060], 10); // New York City coordinates

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
    var initialSize = 9;
    var minSize = 5;

    // Calculate the size based on zoom level with a minimum size
    var size = initialSize - (zoom - 3) * 5;
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
});

// Air group
var aqisiteLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/aqisite.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'green',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
});

// Water group
// Create a LayerGroup for the Water layer group
var waterLayerGroup = L.layerGroup();
var floodplainLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson', {
    style: function (feature) {
        return {
            fillColor: '#ADD8E6',
            color: 'black',
            weight: 0,
            opacity: 0,
            fillOpacity: 0.5
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

// Add the waterLayerGroup to the map
waterLayerGroup.addTo(map);

// Energy group
// Create a LayerGroup for the Energy layer group
var energyLayerGroup = L.layerGroup();

var majoroilstorageLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/majoroilstorage.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'black',
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
            fillColor: '#013220',
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
            weight: 3,
            opacity: 0.6
        };
    }
});

// Add the energyLayerGroup to the map
energyLayerGroup.addTo(map);

// Waste group
// Create a LayerGroup for the Waste layer group
var wasteLayerGroup = L.layerGroup();

var wastetransferfacilityLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/wastetransferfacility.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'purple',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
});

var wastewatertreatmentLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/wastewatertreatment.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'red',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
});

var inactivesolidwastelandfillLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/inactivesolidwastelandfill.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'grey',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
});

var recyclingfacilityLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/recyclingfacility.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'orange',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
});

// Add the wasteLayerGroup to the map
wasteLayerGroup.addTo(map);

// Other
var chemicalstorageLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/chemicalstorage.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'blue',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
});

// Function to set legend symbol shapes and colors
function setLegendSymbol(layerId, color, shape) {
    const legendSymbol = document.getElementById(`legend-${layerId}`);
    
    if (legendSymbol) {
        if (shape === 'circle') {
            // Create a circle SVG element
            legendSymbol.innerHTML = `<svg width="20" height="20"><circle cx="10" cy="10" r="8" fill="${color}" /></svg>`;
        } else if (shape === 'line') {
            // Create a line SVG element
            legendSymbol.innerHTML = `<svg width="20" height="20"><line x1="2" y1="10" x2="18" y2="10" stroke="${color}" stroke-width="4" /></svg>`;
        } else if (shape === 'polygon') {
            // Create a polygon SVG element (example polygon with 5 points)
            legendSymbol.innerHTML = `<svg width="20" height="20"><polygon points="2,2 2,18 18,18 18,2" fill="${color}" /></svg>`;
        }
    }
}

// Set the legend symbol shapes and colors for each layer
setLegendSymbol('aqisite', 'green', 'circle'); // Circle for air quality site
setLegendSymbol('chemicalstorage', 'blue', 'circle'); // Circle for chemical storage
setLegendSymbol('recyclingfacility', 'orange', 'circle'); // Circle for recycling facility
setLegendSymbol('nycso', 'brown', 'circle'); // Circle for NYC Special Operations
setLegendSymbol('nygaspipelines', 'purple', 'line'); // Line for gas pipelines
setLegendSymbol('powerplants', '#013220', 'circle'); // Circle for power plants
setLegendSymbol('wastewatertreatment', 'red', 'circle'); // Circle for wastewater treatment
setLegendSymbol('wastetransferfacility', 'purple', 'circle'); // Circle for waste transfer facility
setLegendSymbol('majoroilstorage', 'black', 'circle'); // Circle for major oil storage
setLegendSymbol('inactivesolidwastelandfill', 'grey', 'circle'); // Circle for major oil storage
setLegendSymbol('floodplain', '#ADD8E6', 'polygon'); // Line for floodplain

// Remove all layers from the map initially
map.removeLayer(nyccountiesLayer);
map.removeLayer(aqisiteLayer);
map.removeLayer(waterLayerGroup);
map.removeLayer(energyLayerGroup);
map.removeLayer(wasteLayerGroup);
map.removeLayer(chemicalstorageLayer);

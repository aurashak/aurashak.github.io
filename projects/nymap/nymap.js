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
}).addTo(map);







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
}).addTo(map);



document.getElementById('aqisite').addEventListener('click', function() {
    if (map.hasLayer(aqisiteLayer)) {
        map.removeLayer(aqisiteLayer);
    } else {
        map.addLayer(aqisiteLayer);
    }
});





// Create a LayerGroup for the Water layer group
var waterLayerGroup = L.layerGroup();

// Water layer - 100 Year Floodplain
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
}).addTo(map);

// Add the 100 Year Floodplain layer to the waterLayerGroup
waterLayerGroup.addLayer(floodplainLayer);

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

// Add the NYC Special Overlays layer to the waterLayerGroup
waterLayerGroup.addLayer(nycsoLayer);

document.getElementById('nycso').addEventListener('click', function() {
    if (map.hasLayer(nycsoLayer)) {
        map.removeLayer(nycsoLayer);
    } else {
        map.addLayer(nycsoLayer);
    }
});

// Add the waterLayerGroup to the map
waterLayerGroup.addTo(map);

document.getElementById('waterLayerGroup').addEventListener('click', function() {
    if (map.hasLayer(waterLayerGroup)) {
        map.removeLayer(waterLayerGroup);
    } else {
        map.addLayer(waterLayerGroup);
    }
});





// Energy group


// Create a LayerGroup for the Water layer group
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
}).addTo(map);

// Add the NYC Special Overlays layer to the waterLayerGroup
energyLayerGroup.addLayer(majoroilstorageLayer);

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
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: '#013220',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(map);

// Add the NYC Special Overlays layer to the waterLayerGroup
energyLayerGroup.addLayer(powerplantsLayer);

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

// Add the NYC Special Overlays layer to the waterLayerGroup
energyLayerGroup.addLayer(nygaspipelinesLayer);

document.getElementById('nygaspipelines').addEventListener('click', function() {
    if (map.hasLayer(nygaspipelinesLayer)) {
        map.removeLayer(nygaspipelinesLayer);
    } else {
        map.addLayer(nygaspipelinesLayer);
    }
});


// Add the waterLayerGroup to the map
energyLayerGroup.addTo(map);

document.getElementById('energyLayerGroup').addEventListener('click', function() {
    if (map.hasLayer(energyLayerGroup)) {
        map.removeLayer(energyLayerGroup);
    } else {
        map.addLayer(energyLayerGroup);
    }
});



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
}).addTo(wasteLayerGroup);

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
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'red',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(wasteLayerGroup);


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
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'grey',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(wasteLayerGroup);


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
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'orange',
            color: 'black',
            weight: 0.25,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(wasteLayerGroup);


document.getElementById('recyclingfacility').addEventListener('click', function() {
    if (map.hasLayer(recyclingfacilityLayer)) {
        map.removeLayer(recyclingfacilityLayer);
    } else {
        map.addLayer(recyclingfacilityLayer);
    }
});


// Add the waterLayerGroup to the map
wasteLayerGroup.addTo(map);

document.getElementById('wasteLayerGroup').addEventListener('click', function() {
    if (map.hasLayer(wasteLayerGroup)) {
        map.removeLayer(wasteLayerGroup);
    } else {
        map.addLayer(wasteLayerGroup);
    }
});


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
}).addTo(map);

document.getElementById('chemicalstorage').addEventListener('click', function() {
    if (map.hasLayer(chemicalstorageLayer)) {
        map.removeLayer(chemicalstorageLayer);
    } else {
        map.addLayer(chemicalstorageLayer);
    }
});

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
            legendSymbol.innerHTML = `<svg width="20" height="20"><polygon points="2,2 2,18 18,18 18,2" fill="${color}" />
            </svg>`;
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




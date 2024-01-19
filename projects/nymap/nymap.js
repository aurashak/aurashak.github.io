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



var aqisiteLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/aqisite.geojson', {
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




var chemicalstorageLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/chemicalstorage.geojson', {
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





var inactivesolidwastelandfillLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/inactivesolidwastelandfill.geojson', {
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




var majoroilstorageLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/majoroilstorage.geojson', {
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




var recyclingfacilityLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/recyclingfacility.geojson', {
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



var nycsoLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/wastetransferfacility.geojson', {
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


var nycsoLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/wastewatertreatment.geojson', {
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


document.getElementById('aqisite').addEventListener('click', function() {
    if (map.hasLayer(aqisiteLayer)) {
        map.removeLayer(aqisiteLayer);
    } else {
        map.addLayer(aqisiteLayer);
    }
});


document.getElementById('chemicalstorage').addEventListener('click', function() {
    if (map.hasLayer(chemicalstorageLayer)) {
        map.removeLayer(chemicalstorageLayer);
    } else {
        map.addLayer(chemicalstorageLayer);
    }
});


document.getElementById('inactivesolidwastelandfill').addEventListener('click', function() {
    if (map.hasLayer(inactivesolidwastelandfillLayer)) {
        map.removeLayer(inactivesolidwastelandfillLayer);
    } else {
        map.addLayer(inactivesolidwastelandfillLayer);
    }
});


document.getElementById('majorroilstorage').addEventListener('click', function() {
    if (map.hasLayer(majoroilstorageLayer)) {
        map.removeLayer(majoroilstorageLayer);
    } else {
        map.addLayer(majoroilstorageLayer);
    }
});


document.getElementById('wastetransferfacility').addEventListener('click', function() {
    if (map.hasLayer(wastetransferfacilityLayer)) {
        map.removeLayer(wastetransferfacilityLayer);
    } else {
        map.addLayer(wastetransferfacilityLayer);
    }
});


document.getElementById('wastewatertreatment').addEventListener('click', function() {
    if (map.hasLayer(wastewatertreatmentLayer)) {
        map.removeLayer(wastewatertreatmentLayer);
    } else {
        map.addLayer(wastewatertreatmentLayer);
    }
});


document.getElementById('recyclingfacility').addEventListener('click', function() {
    if (map.hasLayer(recyclingfacilityLayer)) {
        map.removeLayer(recyclingfacilityLayer);
    } else {
        map.addLayer(recyclingfacilityLayer);
    }
});


document.getElementById('nycso').addEventListener('click', function() {
    if (map.hasLayer(nycsoLayer)) {
        map.removeLayer(nycsoLayer);
    } else {
        map.addLayer(nycsoLayer);
    }
});





document.getElementById('airpollution').addEventListener('click', function() {
    if (map.hasLayer(airpollutionLayer)) {
        map.removeLayer(airpollutionLayer);
    } else {
        map.addLayer(airpollutionLayer);
    }
});


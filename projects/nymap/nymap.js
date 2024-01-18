var map = L.map('map').setView([40.7128, -74.0060], 10); // New York City coordinates

L.control.scale().addTo(map);



var floodplainLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson', {
    style: function (feature) {
        return {
            fillColor: 'red',
            color: 'black',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5 // Adjust fill opacity as needed
        };
    }
}).addTo(map);


// Define a function to calculate marker and line sizes based on zoom level
function calculateSize(zoom) {
    // Define the initial and maximum sizes
    var initialSize = 20;
    var maxSize = 50;

    // Calculate the size based on zoom level
    var size = initialSize + (zoom - 10) * 5; // Adjust as needed

    // Ensure the size doesn't exceed the maximum size
    return Math.min(size, maxSize);
}


var nycsoLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycso.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'black',
            color: 'black',
            weight: 0,
            opacity: 1,
            fillOpacity: 0.5
        });
    }
}).addTo(map);

var powerplantsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycpowerplants.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'green',
            color: 'black',
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.7
        });
    }
}).addTo(map);

var nygaspipelinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson', {
    style: function (feature) {
        var size = calculateSize(map.getZoom());
        return {
            color: 'green',
            weight: size / 10, // Adjust line width based on size
            opacity: 0.8
        };
    }
}).addTo(map);


// Listen for zoom events and update marker and line sizes
map.on('zoomend', function () {
    var zoom = map.getZoom();
    nycsoLayer.eachLayer(function (layer) {
        layer.setRadius(calculateSize(zoom));
    });
    powerplantsLayer.eachLayer(function (layer) {
        layer.setRadius(calculateSize(zoom));
    });
    nygaspipelinesLayer.setStyle({
        weight: calculateSize(zoom) / 10 // Adjust line width based on size
    });
});


// Load and add the NYC GeoJSON layer
var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg', {
    style: function (feature) {
        return {
        };
    }
}).addTo(map);

var openstreetmapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    style: function (feature) {
        return {
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
    
    document.getElementById('powerplants').addEventListener('click', function() {
        if (map.hasLayer(powerplantsLayer)) {
            map.removeLayer(powerplantsLayer);
        } else {
            map.addLayer(powerplantsLayer);
        }
    });

    document.getElementById('nycso').addEventListener('click', function() {
        if (map.hasLayer(nycsoLayer)) {
            map.removeLayer(nycsoLayer);
        } else {
            map.addLayer(nycsoLayer);
        }
    });

    document.getElementById('nygaspipelines').addEventListener('click', function() {
        if (map.hasLayer(nygaspipelinesLayer)) {
            map.removeLayer(nygaspipelinesLayer);
        } else {
            map.addLayer(nygaspipelinesLayer);
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



 


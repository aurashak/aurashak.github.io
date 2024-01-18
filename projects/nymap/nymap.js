var map = L.map('map').setView([40.7128, -74.0060], 10);


var floodplainLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson', {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            fillColor: 'blue',
            color: 'black',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5, // Adjust fill opacity as needed
            radius: 6 // Adjust circle radius as needed
        });
    }
}).addTo(map);


var nycsoLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycso.geojson', {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 10,
            fillColor: 'brown',
            color: 'black',
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.5
        });
    }
}).addTo(map);


var nyccountiesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nyccounties.geojson', {
    style: function (feature) {
        return {
            fillColor: 'gray',
            color: 'black',
            weight: 0.5, // Adjust line weight as needed
            opacity: 0.6, // Adjust line opacity as needed
            fillOpacity: 0.3 // Adjust fill opacity as needed
        };
    }
}).addTo(map);


    
var powerplantsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycpowerplants.geojson', {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 5, // Adjust circle radius as needed
            fillColor: 'red',
            color: 'black',
            weight: 1,
            opacity: 0.7, // Adjust opacity as needed
            fillOpacity: 0.7
        });
    }
}).addTo(map);


var nygaspipelinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson', {
    style: function (feature) {
        return {
            color: 'green', // Adjust line color as needed
            weight: 2, // Adjust line width as needed
            opacity: 0.8 // Adjust line opacity as needed
        };
    }
}).addTo(map);



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


    // Create an object to hold the base layers
    var baseLayers = {
        "Satellite": satelliteLayer,
        "Open Street Maps": openstreetmapLayer
    };

    // Add the base layers to the map control
    L.control.layers(baseLayers).addTo(map);


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


    document.getElementById('nyccounties').addEventListener('click', function() {
        if (map.hasLayer(nyccountiesLayer)) {
            map.removeLayer(nyccountiesLayer);
        } else {
            map.addLayer(nyccountiesLayer);
        }
    });

    
 


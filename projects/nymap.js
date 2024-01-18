document.addEventListener("DOMContentLoaded", function () {
    // Define the bounds of the New York City metropolitan region
    var southWest = L.latLng(40.377399, -74.259090),
        northEast = L.latLng(41.134986, -73.700180),
        bounds = L.latLngBounds(southWest, northEast);

    // Initialize the map with a specific location and zoom level
    var map = L.map('map', {
        center: [40.7128, -74.0060], // New York City coordinates
        zoom: 10, // Initial zoom level
        minZoom: 10, // Minimum zoom level to restrict zooming out
        maxBounds: bounds, // Restrict panning to the New York City metropolitan region
        maxBoundsViscosity: 1.0 // Make the map bounce back when dragged outside the bounds
    });



// Load and add the 100 year floodplain GeoJSON layer
    var floodplainLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson', {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
            fillColor: 'blue',
            color: 'black',
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        });
    }
}).addTo(map);

// Load and add the GeoJSON layer with updated style
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

// Load and add the counties GeoJSON layer with fill and line styling
var nyccountiesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nyccounties.geojson', {
    style: function (feature) {
        return {
            fillColor: 'gray',
            color: 'black',
            weight: 0.15,
            opacity: 0.4,
            fillOpacity: 0.01
        };
    }
}).addTo(map);

    
// Load and add the NYC power plants GeoJSON layer
var powerplantsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycpowerplants.geojson', {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 3,
            fillColor: 'red',
            color: 'black',
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.5
        });
    }
}).addTo(map);


// Load and add the NYC GeoJSON layer
    var nygaspipelinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson', {
        style: function (feature) {
            return {
                color: 'black', // Line color
                weight: 12,      // Line width
                opacity: 0.7    // Line opacity
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



    // Add the base layers to the map
    openstreetmap.addTo(map); // By default, start with OpenStreetMap as the visible layer

    // Add a scale control to the map
    L.control.scale().addTo(map);

    
 });
 


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

    // Define the base layer (OpenStreetMap, S)
    var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    

// Add the base layers to the map
openStreetMap.addTo(map); // By default, start with OpenStreetMap as the visible layer


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

var floodplainLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson', {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            fillColor: 'blue',
            color: 'black',
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.6
        });
    }
}).addTo(map);

var nycsoLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycso.geojson', {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 3,
            fillColor: 'brown',
            color: 'black',
            weight: 0.1,
            opacity: 1,
            fillOpacity: 0.5
        });
    }
}).addTo(map);

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

var nygaspipelinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson', {
    style: {
        color: 'green', // Line color
        weight: 2,      // Line width
        opacity: 0.7    // Line opacity
    }
}).addTo(map);

var satellite = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg', {
    attribution: '© <a href="https://s2maps.eu/">Sentinel-2</a>',
}).addTo(map);

var surfaceTemperatureLayer = L.tileLayer('https://wvs.earthdata.nasa.gov/wms/wms?service=WMS&request=GetMap&layers=MODIS_Terra_Land_Surface_Temperature&width=512&height=512&bbox={bbox-epsg-3857}&format=image/png&transparent=true&time=2023-01-01T00:00:00Z', {
    attribution: 'Surface Temperature data © <a href="https://worldview.earthdata.nasa.gov/">NASA Worldview</a>',
}).addTo(map);

// Function to handle layer toggle
function toggleLayer(layer) {
    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    } else {
        map.addLayer(layer);
    }
}

// Event listeners for toggling layers
document.getElementById('toggle-openstreetmap').addEventListener('click', function () {
    toggleLayer(openStreetMap);
});

document.getElementById('toggle-satellite').addEventListener('click', function () {
    toggleLayer(satellite);
});

document.getElementById('toggle-floodplain').addEventListener('click', function() {
        if (map.hasLayer(floodplainLayer)) {
            map.removeLayer(floodplainLayer);
        } else {
            map.addLayer(floodplainLayer);
        }
 });
    
document.getElementById('toggle-powerplants').addEventListener('click', function() {
        if (map.hasLayer(powerplantsLayer)) {
            map.removeLayer(powerplantsLayer);
        } else {
            map.addLayer(powerplantsLayer);
        }
});

document.getElementById('toggle-nycso').addEventListener('click', function() {
        if (map.hasLayer(nycsoLayer)) {
            map.removeLayer(nycsoLayer);
        } else {
            map.addLayer(nycsoLayer);
        }
});

document.getElementById('toggle-nygaspipelines').addEventListener('click', function() {
        if (map.hasLayer(nygaspipelinesLayer)) {
            map.removeLayer(nygaspipelinesLayer);
        } else {
            map.addLayer(nygaspipelinesLayer);
        }
});

document.getElementById('toggle-nycwaste').addEventListener('click', function() {
        if (map.hasLayer(nycwasteLayer)) {
            map.removeLayer(nycwasteLayer);
        } else {
            map.addLayer(nycwasteLayer);
        }
});

 
    
// Add a scale control to the map
L.control.scale().addTo(map);

    

 


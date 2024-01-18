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

// Create a layer group for base layers
var baseLayers = {
    "Satellite": satelliteLayer,
    "OpenStreetMap": openstreetmapLayer
};

// Create a layer control with baseLayers
var layerControl = L.control.layers(baseLayers, null, {
    position: 'topright' // Position the control in the top right corner
}).addTo(map);

// Set OpenStreetMap as the default base layer
openstreetmapLayer.addTo(map);

// Create a custom control to turn off both base layers
var turnOffLayersControl = L.control({
    position: 'topright'
});

turnOffLayersControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'custom-control');
    div.innerHTML = '<label>Turn Off Base Layers:</label><br><button id="turnOffLayersButton">Turn Off</button>';
    
    // Prevent click events on the control from propagating to the map
    L.DomEvent.disableClickPropagation(div);
    
    L.DomEvent.on(div.querySelector('#turnOffLayersButton'), 'click', function (e) {
        e.stopPropagation();
        satelliteLayer.removeFrom(map);
        openstreetmapLayer.removeFrom(map);
    });

    return div;
};

// Add the combined control container to the map
map.addControl(turnOffLayersControl);




// Function to add air pollution data as a layer
function addairpollutionLayer() {
    // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
    var apiKey = '7aac7c91785ec3578082ffc8aac1c88a';
    var city = 'New York'; // Replace with the city of your choice
    var apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Extract air pollution data from the API response
            var airQualityIndex = data.list[0].main.aqi;

            // Define air quality levels and corresponding colors
            var airQualityLevels = {
                1: 'green',
                2: 'yellow',
                3: 'orange',
                4: 'red',
                5: 'purple'
            };

            // Create a GeoJSON feature with the air pollution data
            var airpollutionFeature = {
                type: 'Feature',
                properties: {
                    airQualityIndex: airQualityIndex
                },
                geometry: {
                    type: 'Point',
                    coordinates: [40.7128, -74.0060] // Replace with the coordinates of your desired location
                }
            };

            // Create a GeoJSON layer with the air pollution feature
            var airpollutionLayer = L.geoJSON(airpollutionFeature, {
                pointToLayer: function (feature, latlng) {
                    var airQualityColor = airQualityLevels[feature.properties.airQualityIndex];
                    return L.circleMarker(latlng, {
                        radius: 10,
                        fillColor: airQualityColor,
                        color: 'black',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.7
                    });
                },
                onEachFeature: function (feature, layer) {
                    var airQualityIndex = feature.properties.airQualityIndex;
                    var airQualityColor = airQualityLevels[airQualityIndex];
                    layer.bindPopup(`Air Quality Index: ${airQualityIndex}<br>Category: ${airQualityColor}`);
                }
            });

            // Add the air pollution layer to the map
            airPollutionLayer.addTo(map);
        })
        .catch(function (error) {
            console.error('Error fetching air pollution data:', error);
        });
}

// Call the function to add the air pollution layer
addairpollutionLayer();




// Event listeners for layer toggling

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



 


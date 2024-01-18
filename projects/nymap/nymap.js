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


const RSSParser = require('rss-parser');
const parser = new RSSParser();

// URL of the RSS feed
const rssFeedUrl = 'https://feeds.enviroflash.info/rss/realtime/94.xml?id=3269D37B-CAD2-5AA1-6AAA091FCE17CC5E';

// Fetch the RSS feed
parser.parseURL(rssFeedUrl, (err, feed) => {
  if (err) {
    console.error('Error fetching RSS feed:', err);
    return;
  }

  // Extract air quality information from the feed's description
  const description = feed.items[0].description;
  const airQualityInfo = parseAirQualityDescription(description);

  // Display air quality information on the map as circles
  displayAirQualityCircles(airQualityInfo);
});

// Function to parse air quality information from the description
function parseAirQualityDescription(description) {
  // ... (same parsing logic as before)
}

// Function to display air quality information as circles on the map
function displayAirQualityCircles(airQualityInfo) {
  if (!airQualityInfo) {
    return; // Invalid or missing air quality information
  }

  // Create circles based on AQI values and style them accordingly
  const circle1 = L.circle([/* Specify latitude and longitude here */], {
    radius: calculateCircleRadius(airQualityInfo.aqi1), // Customize the radius calculation based on AQI
    fillColor: getAirQualityColor(airQualityInfo.aqi1), // Customize the color based on AQI
    color: 'black',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.7,
  }).addTo(map);

  const circle2 = L.circle([/* Specify latitude and longitude here */], {
    radius: calculateCircleRadius(airQualityInfo.aqi2), // Customize the radius calculation based on AQI
    fillColor: getAirQualityColor(airQualityInfo.aqi2), // Customize the color based on AQI
    color: 'black',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.7,
  }).addTo(map);

  // Customize the popup content for each circle (optional)
  circle1.bindPopup(`<strong>${airQualityInfo.location}</strong><br>AQI 1: ${airQualityInfo.aqi1} - ${airQualityInfo.pollutant1}`);
  circle2.bindPopup(`<strong>${airQualityInfo.location}</strong><br>AQI 2: ${airQualityInfo.aqi2} - ${airQualityInfo.pollutant2}`);
}

// Function to calculate circle radius based on AQI (customize this based on your requirements)
function calculateCircleRadius(aqi) {
  // You can implement your own logic to determine the circle radius based on AQI values
  // For example, mapping AQI values to radius ranges
  // Here's a simplified example:
  if (aqi <= 50) {
    return 1000; // Example radius for AQI <= 50
  } else if (aqi <= 100) {
    return 2000; // Example radius for AQI <= 100
  } else {
    return 3000; // Example radius for AQI > 100
  }
}

// Function to get circle color based on AQI (customize this based on your requirements)
function getAirQualityColor(aqi) {
  // You can implement your own logic to determine the circle color based on AQI values
  // For example, mapping AQI values to color ranges
  // Here's a simplified example:
  if (aqi <= 50) {
    return 'green'; // Example color for AQI <= 50
  } else if (aqi <= 100) {
    return 'yellow'; // Example color for AQI <= 100
  } else if (aqi <= 150) {
    return 'orange'; // Example color for AQI <= 150
  } else {
    return 'red'; // Example color for AQI > 150
  }
}



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



 


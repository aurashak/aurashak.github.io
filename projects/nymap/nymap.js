// Define the bounds for the New York City Tri-State area
var bounds = L.latLngBounds(
    L.latLng(40.4774, -74.2591), // Southwest corner (bottom-left)
    L.latLng(41.4754, -73.3913)  // Northeast corner (top-right)
);

// Create and configure the map with the specified bounds
var map = L.map('map', {
    maxBounds: bounds,          // Set maxBounds to limit zooming out
    maxBoundsViscosity: 1.0,   // Elastic effect on exceeding bounds
    minZoom: 7,                // Minimum zoom level
    maxZoom: 16                // Maximum zoom level (adjust as needed)
}).setView([40.7128, -74.0060], 12); // New York City coordinates, closer zoom level



L.control.scale().addTo(map);

// Function to calculate marker size based on zoom level
function calculateMarkerSize(zoom) {
    // Define the initial and minimum sizes
    var initialSize = 10;
    var minSize = 5;

    // Calculate the size based on zoom level with a minimum size
    var size = initialSize - (zoom - 3) * 5;
    return Math.max(size, minSize);
}

// NYC Counties Layer (Initially hidden)
var nyccountiesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nyccounties.geojson', {
    style: function (feature) {
        return {
            fillColor: 'grey',
            color: 'black',
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: .8
        };
    },
    pointToLayer: function (feature, latlng) {
        // Get the county name from the 'NAME' property
        var countyName = feature.properties.NAME;

        // Create a label marker with the county name as the label
        return L.marker(latlng, {
            icon: L.divIcon({
                className: 'leaflet-div-label',
                html: countyName, // Use the 'NAME' property as the label
                iconSize: [100, 40] // Adjust the size of the label marker
            })
        });
    }
});




// Base Map Layers
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

openstreetmapLayer.addTo(map);



var baseLayers = {
    "OpenStreetMap": openstreetmapLayer,
    "Satellite": satelliteLayer,
    "Outlines": nyccountiesLayer, // Create an empty layer group for "Turn Off"
};

var layerControl = L.control.layers(baseLayers, null, {
    position: 'topright' // Position the control in the top right corner
}).addTo(map);











// Water Layer Group
var waterLayerGroup = L.layerGroup();


// 100 Year Floodplain Layer
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
}).addTo(waterLayerGroup);

// NYC CSO Layer
var nycsoLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycso.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'brown',
            color: 'black',
            weight: 0,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(waterLayerGroup);




// Energy Layer Group
var energyLayerGroup = L.layerGroup();


// Major Oil Storage Layer
var majoroilstorageLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/majoroilstorage.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'black',
            color: 'black',
            weight: 0,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(energyLayerGroup);

// Power Plants Layer
var powerplantsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycpowerplants.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: '#FFC0CB',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(energyLayerGroup);

// NY Gas Pipelines Layer
var nygaspipelinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson', {
    style: function (feature) {
        var size = calculateMarkerSize(map.getZoom());
        return {
            color: 'purple',
            weight: 3,
            opacity: 0.6
        };
    }
}).addTo(energyLayerGroup);




// Waste Layer Group
var wasteLayerGroup = L.layerGroup();

// Waste Transfer Facility Layer
var wastetransferfacilityLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/wastetransferfacility.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'purple',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(wasteLayerGroup);

// Wastewater Treatment Layer
var wastewatertreatmentLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/wastewatertreatment.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'red',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(wasteLayerGroup);

// Inactive Solid Waste Landfill Layer
var inactivesolidwastelandfillLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/inactivesolidwastelandfill.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'grey',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(wasteLayerGroup);

// Recycling Facility Layer
var recyclingfacilityLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/recyclingfacility.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'orange',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(wasteLayerGroup);



// Chemical Storage Layer
var chemicalstorageLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/chemicalstorage.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'blue',
            color: 'black',
            weight: 0,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
});




// Create a layer group for air quality markers
const airQualityLayer = L.layerGroup();

// Replace 'YOUR_API_TOKEN' with your actual AQICN API token
const apiToken = 'babc945d5af70ef9e270d8f91dc09e224b8d1aaa';

// Define the AQICN API endpoint
const apiUrl = `https://api.waqi.info/map/bounds/?token=${apiToken}&latlng=40.4774,-74.2591,40.9176,-73.7004`;

// Make an API request to retrieve air quality data
fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        // Process the air quality data and display it on the map
        const stations = data.data;
        stations.forEach((station) => {
            const lat = station.lat;
            const lon = station.lon;
            const aqi = station.aqi;

            // Create a custom marker based on AQI value
            const marker = L.circleMarker([lat, lon], {
                radius: 10,
                fillColor: getColor(aqi),
                color: 'transparent', // Set marker border color to transparent
                weight: 0, // Set marker border weight to 0
                opacity: 0.7, // Adjust marker opacity as desired
                fillOpacity: 0.8,
            });

            // Add a popup with AQI information
            marker.bindPopup(`AQI: ${aqi}`);
            marker.addTo(map);
        });
    })
    .catch((error) => {
        console.error('Error fetching air quality data:', error);
    });


// Define a function to set marker color based on AQI value
function getColor(aqi) {
    if (aqi <= 50) {
        return 'green'; // Good
    } else if (aqi <= 100) {
        return 'yellow'; // Moderate
    } else if (aqi <= 150) {
        return 'orange'; // Unhealthy for Sensitive Groups
    } else if (aqi <= 200) {
        return 'red'; // Unhealthy
    } else if (aqi <= 300) {
        return 'purple'; // Very Unhealthy
    } else {
        return 'maroon'; // Hazardous
    }
}





document.getElementById('nycso').addEventListener('click', function() {
    if (map.hasLayer(nycsoLayer)) {
        map.removeLayer(nycsoLayer);
    } else {
        map.addLayer(nycsoLayer);
    }
});


document.getElementById('floodplain').addEventListener('click', function() {
    if (map.hasLayer(floodplainLayer)) {
        map.removeLayer(floodplainLayer);
    } else {
        map.addLayer(floodplainLayer);
    }
});




document.getElementById('majoroilstorage').addEventListener('click', function() {
    if (map.hasLayer(majoroilstorageLayer)) {
        map.removeLayer(majoroilstorageLayer);
    } else {
        map.addLayer(majoroilstorageLayer);
    }
});


document.getElementById('powerplants').addEventListener('click', function() {
    if (map.hasLayer(powerplantsLayer)) {
        map.removeLayer(powerplantsLayer);
    } else {
        map.addLayer(powerplantsLayer);
    }
});

document.getElementById('nygaspipelines').addEventListener('click', function() {
    if (map.hasLayer(nygaspipelinesLayer)) {
        map.removeLayer(nygaspipelinesLayer);
    } else {
        map.addLayer(nygaspipelinesLayer);
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

document.getElementById('inactivesolidwastelandfill').addEventListener('click', function() {
    if (map.hasLayer(inactivesolidwastelandfillLayer)) {
        map.removeLayer(inactivesolidwastelandfillLayer);
    } else {
        map.addLayer(inactivesolidwastelandfillLayer);
    }
});

document.getElementById('recyclingfacility').addEventListener('click', function() {
    if (map.hasLayer(recyclingfacilityLayer)) {
        map.removeLayer(recyclingfacilityLayer);
    } else {
        map.addLayer(recyclingfacilityLayer);
    }
});

document.getElementById('chemicalstorage').addEventListener('click', function() {
    if (map.hasLayer(chemicalstorageLayer)) {
        map.removeLayer(chemicalstorageLayer);
    } else {
        map.addLayer(chemicalstorageLayer);
    }
});


document.getElementById('airQuality').addEventListener('click', function() {
    console.log('Clicked on airQuality'); // Debugging statement
    if (map.hasLayer(airQualityLayer)) {
        map.removeLayer(airQualityLayer);
        console.log('airQualityLayer removed'); // Debugging statement
    } else {
        map.addLayer(airQualityLayer);
        console.log('airQualityLayer added'); // Debugging statement
    }
});

// Add the following code to turn off the "Air Quality" layer when the checkbox is unchecked
document.getElementById('airQuality').addEventListener('change', function() {
    if (!this.checked) {
        if (map.hasLayer(airQualityLayer)) {
            map.removeLayer(airQualityLayer);
            console.log('airQualityLayer turned off'); // Debugging statement
        }
    }
});



document.getElementById('energyLayerGroup').addEventListener('click', function() {
    if (map.hasLayer(energyLayerGroup)) {
        map.removeLayer(energyLayerGroup);
        // If the group toggle is turned off, turn off individual layers as well
        map.removeLayer(majoroilstorageLayer);
        map.removeLayer(powerplantsLayer);
        map.removeLayer(nygaspipelinesLayer);
        // Reset the individual layer toggle buttons to off state
        document.getElementById('majoroilstorage').checked = false;
        document.getElementById('powerplants').checked = false;
        document.getElementById('nygaspipelines').checked = false;
    } else {
        map.addLayer(energyLayerGroup);
        // If the group toggle is turned on, turn on individual layers if they were previously checked
        if (document.getElementById('majoroilstorage').checked) {
            map.addLayer(majoroilstorageLayer);
        }
        if (document.getElementById('powerplants').checked) {
            map.addLayer(powerplantsLayer);
        }
        if (document.getElementById('nygaspipelines').checked) {
            map.addLayer(nygaspipelinesLayer);
        }
    }
});


document.getElementById('waterLayerGroup').addEventListener('click', function() {
    if (map.hasLayer(waterLayerGroup)) {
        map.removeLayer(waterLayerGroup);
        // If the group toggle is turned off, turn off individual layers as well
        map.removeLayer(floodplainLayer);
        map.removeLayer(nycsoLayer);
        // Reset the individual layer toggle buttons to off state
        document.getElementById('floodplain').checked = false;
        document.getElementById('nycso').checked = false;
    } else {
        map.addLayer(waterLayerGroup);
        // If the group toggle is turned on, turn on individual layers if they were previously checked
        if (document.getElementById('floodplain').checked) {
            map.addLayer(floodplainLayer);
        }
        if (document.getElementById('nycso').checked) {
            map.addLayer(nycsoLayer);
        }
    }
});


// Toggle Waste Layer Group
document.getElementById('wasteLayerGroup').addEventListener('click', function() {
    if (map.hasLayer(wasteLayerGroup)) {
        map.removeLayer(wasteLayerGroup);
        // If the group toggle is turned off, turn off individual layers as well
        map.removeLayer(wastetransferfacilityLayer);
        map.removeLayer(wastewatertreatmentLayer);
        map.removeLayer(inactivesolidwastelandfillLayer);
        map.removeLayer(recyclingfacilityLayer);
        // Reset the individual layer toggle buttons to off state
        document.getElementById('wastetransferfacility').checked = false;
        document.getElementById('wastewatertreatment').checked = false;
        document.getElementById('inactivesolidwastelandfill').checked = false;
        document.getElementById('recyclingfacility').checked = false;
    } else {
        map.addLayer(wasteLayerGroup);
        // If the group toggle is turned on, turn on individual layers if they were previously checked
        if (document.getElementById('wastetransferfacility').checked) {
            map.addLayer(wastetransferfacilityLayer);
        }
        if (document.getElementById('wastewatertreatment').checked) {
            map.addLayer(wastewatertreatmentLayer);
        }
        if (document.getElementById('inactivesolidwastelandfill').checked) {
            map.addLayer(inactivesolidwastelandfillLayer);
        }
        if (document.getElementById('recyclingfacility').checked) {
            map.addLayer(recyclingfacilityLayer);
        }
    }
});




// Set the legend symbol shapes and colors for each layer
setLegendSymbol('airQuality', 'green', 'circle');
setLegendSymbol('chemicalstorage', 'blue', 'circle');
setLegendSymbol('recyclingfacility', 'orange', 'circle');
setLegendSymbol('nycso', 'brown', 'circle');
setLegendSymbol('nygaspipelines', 'purple', 'line');
setLegendSymbol('powerplants', '#FFC0CB', 'circle');
setLegendSymbol('wastewatertreatment', 'red', 'circle');
setLegendSymbol('wastetransferfacility', 'purple', 'circle');
setLegendSymbol('majoroilstorage', 'black', 'circle');
setLegendSymbol('inactivesolidwastelandfill', 'grey', 'circle');
setLegendSymbol('floodplain', '#ADD8E6', 'polygon');

// Function to set legend symbols
function setLegendSymbol(layerId, color, shape) {
    const legendSymbol = document.getElementById(`legend-${layerId}`);
    
    if (legendSymbol) {
        if (shape === 'circle') {
            // Create a circle SVG element with a slightly smaller size
            legendSymbol.innerHTML = `<svg width="25" height="25"><circle cx="12.5" cy="12.5" r="10" fill="${color}" /></svg>`;
        } else if (shape === 'line') {
            // Create a line SVG element with a slightly smaller size
            legendSymbol.innerHTML = `<svg width="25" height="25"><line x1="2.5" y1="12.5" x2="22.5" y2="12.5" stroke="${color}" stroke-width="5" /></svg>`;
        } else if (shape === 'polygon') {
            // Create a polygon SVG element (example polygon with 5 points) with a slightly smaller size
            legendSymbol.innerHTML = `<svg width="25" height="25"><polygon points="2.5,2.5 2.5,22.5 22.5,22.5 22.5,2.5" fill="${color}" /></svg>`;
        }
    }    
}





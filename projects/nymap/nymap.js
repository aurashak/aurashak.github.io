// Initialize the map
var mymap = L.map('map', {
    center: [40.7128, -74.0060],
    zoom: 12 // Set your desired zoom level here
});

// Rest of your code...

// Define the base layers
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var satelliteMap = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a> contributors'
});

// Create a group for overlay layers (TBD layers)
var overlayLayers = L.layerGroup();

// Add a marker for a specific location (optional)
var marker = L.marker([40.7128, -74.0060]).addTo(mymap);
marker.bindPopup("<b>New York City</b>").openPopup();

// Add the base layers to the map
openStreetMap.addTo(mymap);

// Define a scale control and add it to the map
L.control.scale().addTo(mymap);

// Create an object to hold the base layers
var baseMaps = {
    "OpenStreetMap": openStreetMap,
    "Satellite": satelliteMap
};

// Create an object to hold the overlay layers
var overlayMaps = {
    "TBD Layer": overlayLayers
};

// Add layer control to toggle between base layers and overlay layers
L.control.layers(baseMaps, overlayMaps).addTo(mymap);


// Define a custom layer to display air pollution data
var airPollutionLayer = L.layerGroup();

// Function to fetch and update air pollution data
function updateAirPollutionData() {
    // Make an API request to Google Air Pollution API
    // Parse the response and extract pollution data

    // Example data (replace with real data)
    var pollutionData = [
        { lat: 40.7128, lon: -74.0060, value: 10 }, // Example pollution data
        // Add more data points as needed
    ];

    // Clear existing data on the air pollution layer
    airPollutionLayer.clearLayers();

    // Add new pollution data to the layer
    pollutionData.forEach(function (data) {
        // Create a circle or marker based on pollution level
        var pollutionCircle = L.circle([data.lat, data.lon], {
            radius: data.value * 1000, // Adjust the radius based on pollution level
            color: 'red', // Customize the color based on pollution level
        });

        pollutionCircle.addTo(airPollutionLayer);
    });

    // Add the updated air pollution layer to the map
    airPollutionLayer.addTo(mymap);
}

// Call the function to initially load air pollution data
updateAirPollutionData();

// Schedule periodic updates (e.g., every 15 minutes)
setInterval(updateAirPollutionData, 900000); // 900,000 milliseconds = 15 minutes

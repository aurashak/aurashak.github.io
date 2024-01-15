// Initialize the map with a specific location and zoom level
var map = L.map('map').setView([40.7128, -74.0060], 13); // New York City coordinates

// Define the base layer (OpenStreetMap)
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add the base layer (OpenStreetMap) to the map
openStreetMap.addTo(map);

// Load and add the GeoJSON layer with initial style
var geojsonLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nyccounties.geojson', {
    style: {
        color: 'blue', // Initial color
        weight: 2,      // Initial line weight
        opacity: 0.7    // Initial opacity
    }
}).addTo(map);

// Create a control panel for styling options
var stylingControl = L.control({ position: 'topright' });

stylingControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<h4>GeoJSON Styling</h4>' +
        '<label for="color">Color:</label>' +
        '<input type="color" id="color" value="blue"><br>' +
        '<label for="weight">Line Weight:</label>' +
        '<input type="range" id="weight" min="1" max="10" value="2"><br>' +
        '<label for="opacity">Opacity:</label>' +
        '<input type="range" id="opacity" min="0" max="1" step="0.1" value="0.7"><br>';

    return div;
};

stylingControl.addTo(map);

// Function to update the style based on user input
function updateStyle() {
    var color = document.getElementById('color').value;
    var weight = document.getElementById('weight').value;
    var opacity = document.getElementById('opacity').value;

    geojsonLayer.setStyle({
        color: color,
        weight: weight,
        opacity: opacity
    });
}

// Add event listeners to input elements
document.getElementById('color').addEventListener('input', updateStyle);
document.getElementById('weight').addEventListener('input', updateStyle);
document.getElementById('opacity').addEventListener('input', updateStyle);

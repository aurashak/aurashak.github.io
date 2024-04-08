// Initialize the map
var map = L.map('emissionsmap', {
    // Set initial center and zoom level for focusing on the world
    center: [0, 0], // Center coordinates to focus on the world
    zoom: 2, // Zoom level adjusted to show the world
    // Disable zooming and scrolling
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false
});

// Add tile layer from OpenStreetMap with only labels
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    pane: 'labels', // Add labels to a separate pane
    minZoom: 2, // Set minimum zoom level
    maxZoom: 19, // Set maximum zoom level
    opacity: 0.5 // Adjust opacity for better visibility
}).addTo(map);

// Create a pane for the GeoJSON layer
map.createPane('geojsonPane');
map.getPane('geojsonPane').style.zIndex = 400; // Set z-index to appear above the tile layer

// Load GeoJSON file for the world map
var geojsonLayer = new L.GeoJSON.AJAX("https://aurashak.github.io/geojson/world/worldcountries.geojson", {
    style: function(feature) {
        return {
            fillColor: 'green', // Fill color of the polygons
            weight: 1, // Stroke width
            opacity: 1, // Stroke opacity
            color: 'white', // Stroke color
            fillOpacity: 0.7 // Fill opacity
        };
    },
    pane: 'geojsonPane' // Add GeoJSON layer to the custom pane
});

// Add the GeoJSON layer to the map
geojsonLayer.addTo(map);

// Zoom the map to the extent of the GeoJSON layer
map.fitBounds(geojsonLayer.getBounds());



/*
 
// Load GeoJSON file for the world map
var geojsonLayer = new L.GeoJSON.AJAX("countries.geojson");

// Function to create the choropleth map
function createChoroplethMap(year) {
    // Filter emissions data for the given year
    var yearColumn = year.toString();
    var yearEmissions = mergedData.map(function (feature) {
        return {
            'type': 'Feature',
            'properties': {
                'name': feature.properties.name,
                'emissions': feature.properties[yearColumn]
            },
            'geometry': feature.geometry
        };
    });

    // Create GeoJSON layer with choropleth
    var choroplethLayer = L.geoJSON(yearEmissions, {
        style: function (feature) {
            return {
                fillColor: getColor(feature.properties.emissions),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<b>' + feature.properties.name + '</b><br>Emissions: ' + feature.properties.emissions);
        }
    });

    // Add GeoJSON layer to the map
    choroplethLayer.addTo(map);

    // Create legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var grades = [0, 10, 20, 50, 100, 200, 500, 1000];
        var labels = [];
        var from, to;

        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map);
}

// Example usage: create choropleth map for the year 2022
createChoroplethMap(2022);

// Slider
var slider = document.getElementById('slider');
slider.oninput = function () {
    map.eachLayer(function (layer) {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });
    createChoroplethMap(parseInt(this.value));
};


*/
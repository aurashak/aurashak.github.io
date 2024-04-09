// Initialize the map
var map = L.map('emissionsmap', {
    // Set initial center and zoom level for focusing on the world
    center: [0, 0], // Center coordinates to focus on the world
    zoom: 2, // Adjusted to a higher zoom level
    minZoom: 2, // Minimum zoom level
    maxZoom: 10, // Maximum zoom level
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    dragging: true,
    boxZoom: false,
    keyboard: false,
    touchZoom: true
});

// Define the bounds to limit panning to the world extent without elasticity
var bounds = [
    [-90, -180], // Southwest coordinates
    [90, 180]    // Northeast coordinates
];
map.setMaxBounds(bounds);
map.setMinZoom(2); // Optionally set the minimum zoom level to prevent zooming out beyond the world extent
map.setMaxZoom(10); // Optionally set the maximum zoom level

// Add tile layer from OpenStreetMap with only labels
console.log("Adding tile layer...");
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.5 // Adjust opacity for better visibility
}).addTo(map);

// Function to create choropleth map based on selected year
const createChoroplethMap = (year) => {
    // Fetch the GeoJSON file for the selected year
    fetch(`https://aurashak.github.io/projects/emissionsmap/data/worldco2total_${year}.geojson`)
        .then(response => response.json())
        .then(geojsonData => {
            console.log(`GeoJSON data loaded successfully for year ${year}:`, geojsonData);
            
            // Now you can proceed to create the choropleth map using geojsonData
            // Example code to create choropleth map goes here
            const geojsonLayer = L.geoJSON(geojsonData, {
                style: function(feature) {
                    const value = feature.properties[year]; // Access properties based on the selected year
                    return {
                        fillColor: getColor(value),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.6
                    };
                },
                onEachFeature: function(feature, layer) {
                    layer.bindTooltip(`<b>${feature.properties.NAME}</b><br>MtCO2e Emissions: ${feature.properties[year].toFixed(2)}`); // Limit decimals to two digits
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error(`Error loading GeoJSON data for year ${year}:`, error);
        });
};

// Event listener for slider input change
document.getElementById('emissionsslider').addEventListener('input', function() {
    const selectedYear = parseInt(this.value);
    createChoroplethMap(selectedYear);
});

// Initial map creation for the default year (2022)
createChoroplethMap(2022);



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
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


// Define the color scales for values 1-5 (white to blue) and 6-10 (light red to dark red)
const colorScale1 = chroma.scale(['white', 'blue']).mode('lab').colors(5);
const colorScale2 = chroma.scale(['#FF9999', '#8B0000']).mode('lab').colors(5);

// Combine the color scales into one array
const colorScale = colorScale1.concat(colorScale2);


// Select the dropdown menu element
const yearSelector = document.getElementById('year-selector');

// Loop through the years from 1970 to 2022
for (let year = 1970; year <= 2022; year++) {
    // Create an option element for each year
    const option = document.createElement('option');
    option.value = year; // Set the value attribute to the year
    option.textContent = year; // Set the text content to the year
    // Append the option to the dropdown menu
    yearSelector.appendChild(option);
}

// Add event listener to the dropdown menu
yearSelector.addEventListener('change', function() {
    const selectedYear = this.value;
    createChoroplethMap(selectedYear);
});



// Fetch the GeoJSON file
console.log("Fetching GeoJSON file...");
fetch("https://aurashak.github.io/projects/emissionsmap/data/worldco2total.geojson")
    .then(response => response.json())
    .then(geojsonData => {
        console.log("GeoJSON data loaded successfully:", geojsonData);
        
        // Function to create choropleth map based on selected year
        const createChoroplethMap = (year) => {
            // Clear existing layers
            if (geojsonLayer) {
                map.removeLayer(geojsonLayer);
            }

            // Create new choropleth map layer
            geojsonLayer = L.geoJSON(geojsonData, {
                style: function(feature) {
                    const value = feature.properties[year]; // Get emissions value for the selected year
                    return {
                        fillColor: getColor(value),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.6
                    };
                },
                onEachFeature: function(feature, layer) {
                    const emissionValue = parseFloat(feature.properties[year]).toFixed(2); // Convert to float and limit to 2 decimal places
                    layer.bindTooltip(`<b>${feature.properties.NAME}</b><br>MtCO2e Emissions (${year}): ${emissionValue}`);
                }
            }).addTo(map);
        };

        // Create legend after the colorScale is defined
        const legend = L.control({ position: 'bottomleft' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'emissionsmaplegend');
            div.innerHTML += '<div class="legend-title">Metric tons of carbon dioxide per year (MtCO2) </div>'; // Add title
            const labels = ['0-1', '1-100', '100-1000', '1000-2000', '2000-4000', '4000-6000', '6000-8000', '8000-12000', '12000-17000'];
        
            for (let i = 0; i < labels.length; i++) {
                div.innerHTML += `
                    <div class="emissionsmaplegend-item">
                        <div class="emissionsmaplegend-color" style="background-color: ${colorScale[i]};"></div>
                        <div class="emissionsmaplegend-label">${labels[i]}</div>
                    </div>
                `;
            }
        
            return div;
        };
        
        legend.addTo(map);

        // Function to get color based on value
        const getColor = (value) => {
            if (value >= 0 && value <= 1) {
                return colorScale[0];
            } else if (value > 1 && value <= 100) {
                return colorScale[1];
            } else if (value > 100 && value <= 1000) {
                return colorScale[2];
            } else if (value > 1000 && value <= 2000) {
                return colorScale[3];
            } else if (value > 2000 && value <= 4000) {
                return colorScale[4];
            } else if (value > 4000 && value <= 6000) {
                return colorScale[5];
            } else if (value > 6000 && value <= 8000) {
                return colorScale[6];
            } else if (value > 8000 && value <= 12000) {
                return colorScale[7];
            } else if (value > 12000 && value <= 17000) {
                return colorScale[8];
            } else {
                return 'white'; // Default color
            }
        };

        // Initialize the choropleth map with default year (2022)
        let geojsonLayer; // Variable to hold the GeoJSON layer
        createChoroplethMap('2022');

        // Create slider for years between 1970 and 2022
        const slider = document.getElementById('emissionsslider');
        slider.min = 1970;
        slider.max = 2022;
        slider.value = 2022; // Default value

        slider.addEventListener('input', function() {
            const selectedYear = this.value;
            createChoroplethMap(selectedYear);
        });
    })
    .catch(error => {
        console.error("Error loading GeoJSON data:", error);
    });


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
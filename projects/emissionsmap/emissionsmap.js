// Initialize the map
var map = L.map('emissionsmap', {
    // Set initial center and zoom level for focusing on the world
    center: [0, 0], // Center coordinates to focus on the world
    zoom: 2, // Adjusted to a higher zoom level
    minZoom: 2, // Minimum zoom level
    maxZoom: 5, // Maximum zoom level
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

// Function to create choropleth map based on selected year
const createChoroplethMap = (year) => {
    // Fetch the GeoJSON file
    console.log("Fetching GeoJSON file...");
    fetch("https://aurashak.github.io/projects/emissionsmap/data/worldco2total.geojson")
        .then(response => response.json())
        .then(geojsonData => {
            console.log("GeoJSON data loaded successfully:", geojsonData);

            // Clear existing layers if any
            if (geojsonLayer) {
                map.removeLayer(geojsonLayer);
            }

            // Create new choropleth map layer with onEachFeature function
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

                    // Mouseover event to show actual info and hide placeholder text
                    layer.on('mouseover', function(e) {
                        infoBox.update(feature.properties.NAME, emissionValue, year);
                    });

                    // Mouseout event to restore placeholder text
                    layer.on('mouseout', function(e) {
                        infoBox.updatePlaceholder();
                    });
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error("Error loading GeoJSON data:", error);
        });
};

// Create emissions info box
const infoBox = L.control({ position: 'topright' });
infoBox.onAdd = function() {
    this._div = L.DomUtil.create('div', 'emissionsinfo-box');
    this.updatePlaceholder(); // Add placeholder text initially
    return this._div;
};
infoBox.update = function(name, value, year) {
    this._div.innerHTML = `<b>${name}</b><br>MtCO2e(${year}): ${value}`;
};
infoBox.updatePlaceholder = function() {
    this._div.innerHTML = "<b>Country</b><br>Amount";
};
infoBox.remove = function() {
    if (this._div) {
        this._div.innerHTML = '';
    }
};
infoBox.addTo(map);


// Add event listener to the dropdown menu
yearSelector.addEventListener('change', function() {
    const selectedYear = this.value;
    createChoroplethMap(selectedYear);
});

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





// Define play button and year display elements
const playButton = document.getElementById('play-button');
const yearDisplay = document.getElementById('year-display');

// Function to animate through the years
const animateYears = () => {
    let year = 1970; // Start from 1970
    const interval = setInterval(() => {
        createChoroplethMap(year); // Update map with current year
        yearDisplay.textContent = year; // Update year display
        year++; // Move to the next year
        if (year > 2022) {
            clearInterval(interval); // Stop animation when reaching 2022
        }
    }, 250); // Interval between each year (250 milliseconds)
};

// Event listener for the play button
playButton.addEventListener('click', animateYears);




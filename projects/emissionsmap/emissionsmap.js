// Initialize the map
var map = L.map('emissionsmap', {
    // Set initial center and zoom level for focusing on the world
    center: [0, 0], // Center coordinates to focus on the world
    zoom: 2, // Adjusted to a higher zoom level
    minZoom: 2, // Minimum zoom level
    maxZoom: 10, // Maximum zoom level
    // Disable zooming and scrolling
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    dragging: true,
    boxZoom: false,
    keyboard: false,
    touchZoom: true
});

// Add tile layer from OpenStreetMap with only labels
console.log("Adding tile layer...");
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.5 // Adjust opacity for better visibility
}).addTo(map);

// Fetch the GeoJSON file
console.log("Fetching GeoJSON file...");
fetch("https://aurashak.github.io/projects/emissionsmap/data/countriestotalco2.geojson")
    .then(response => response.json())
    .then(geojsonData => {
        console.log("GeoJSON data loaded successfully:", geojsonData);
        
        // Now you can proceed to create the choropleth map using geojsonData
        // Example code to create choropleth map goes here
        // Define the color scale and map the values to colors
        const colorScale = chroma.scale(['white', 'red']).mode('lab').colors(6); // Adjust color scale
        const geojsonLayer = L.geoJSON(geojsonData, {
            style: function(feature) {
                // Here, you can access each feature's properties and set its style
                // Example:
                const value = feature.properties.worldcountriestotalco2_field_89; // Assuming 'worldcountriestotalco2_field_89' is the property in GeoJSON representing emissions data
                return {
                    fillColor: getColor(value),
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.8
                };
            },
            onEachFeature: function(feature, layer) {
                // Add tooltips
                layer.bindTooltip(`<b>${feature.properties.NAME}</b><br>Emissions: ${feature.properties.worldcountriestotalco2_field_89}`);
            }
        }).addTo(map);

        // Create legend
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'emissionsmaplegend');
            const labels = ['0-100', '100-3000', '3000-6000', '6000-9000', '9000-12000', '12000-17000'];

            // Loop through colors and add legend items
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
    })
    .catch(error => {
        console.error("Error loading GeoJSON data:", error);
    });

// Function to get color based on value
const getColor = (value) => {
    if (value >= 0 && value <= 100) {
        return colorScale[0];
    } else if (value > 100 && value <= 3000) {
        return colorScale[1];
    } else if (value > 3000 && value <= 6000) {
        return colorScale[2];
    } else if (value > 6000 && value <= 9000) {
        return colorScale[3];
    } else if (value > 9000 && value <= 12000) {
        return colorScale[4];
    } else if (value > 12000 && value <= 17000) {
        return colorScale[5];
    } else {
        return 'white'; // Default color
    }
};




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
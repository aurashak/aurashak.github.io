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





// Fetch the GeoJSON file
console.log("Fetching GeoJSON file...");
fetch("https://aurashak.github.io/projects/emissionsmap/data/worldco2total.geojson")
    .then(response => response.json())
    .then(geojsonData => {
        console.log("GeoJSON data loaded successfully:", geojsonData);
        
        // Now you can proceed to create the choropleth map using geojsonData
        // Example code to create choropleth map goes here
        const geojsonLayer = L.geoJSON(geojsonData, {
            style: function(feature) {
                const value = feature.properties['2022']; // Assuming 'worldcountriestotalco2_field_89' is the property in GeoJSON representing emissions data
                return {
                    fillColor: getColor(value),
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.6
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindTooltip(`<b>${feature.properties.NAME}</b><br>MtCO2e Emissions: ${feature.properties['2022']}`);
            }
        }).addTo(map);

        // Create legend after the colorScale is defined
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'emissionsmaplegend');
            const labels = ['0-100', '100-1000', '1000-3000', '3000-5000', '5000-7000', '7000-9000', '9000-11000', '11000-13000', '13000-15000', '15000-17000'];
        
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
    } else if (value > 100 && value <= 1000) {
        return colorScale[1];
    } else if (value > 1000 && value <= 3000) {
        return colorScale[2];
    } else if (value > 3000 && value <= 5000) {
        return colorScale[3];
    } else if (value > 5000 && value <= 7000) {
        return colorScale[4];
    } else if (value > 7000 && value <= 9000) {
        return colorScale[5];
    } else if (value > 9000 && value <= 11000) {
        return colorScale[6];
    } else if (value > 11000 && value <= 13000) {
        return colorScale[7];
    } else if (value > 13000 && value <= 15000) {
        return colorScale[8];
    } else if (value > 15000 && value <= 17000) {
        return colorScale[9];
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
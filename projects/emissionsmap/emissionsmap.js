// Initialize the map
var map = L.map('emissionsmap', {
    // Set initial center and zoom level for focusing on the world
    center: [0, 0], // Center coordinates to focus on the world
    zoom: 2, // Adjusted to a higher zoom level
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
console.log("Adding tile layer...");
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.5 // Adjust opacity for better visibility
}).addTo(map);

// Fetch the GeoJSON file
console.log("Fetching GeoJSON file...");
fetch("https://aurashak.github.io/geojson/emissionsmap/data/countriestotalco2.geojson")
  .then(response => response.json())
  .then(geojsonData => {
    console.log("GeoJSON data loaded successfully:", geojsonData);
        
    // Now you can proceed to create the choropleth map using geojsonData
    // Example code to create choropleth map goes here
    // Define the color scale and map the values to colors
    const colorScale = chroma.scale('YlGnBu').mode('lab').colors(geojsonData.features.length); // Adjust color scale according to the number of features
    const geojsonLayer = L.geoJSON(geojsonData, {
        style: function(feature) {
            // Here, you can access each feature's properties and set its style
            // Example:
            const value = feature.properties.worldcountriestotalco2_field_89; // Assuming 'worldcountriestotalco2_field_89' is the property in GeoJSON representing emissions data
            return {
                fillColor: getColor(value, colorScale),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
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
        const div = L.DomUtil.create('div', 'legend');
        const labels = [];
        const grades = []; // You can define grades based on the range of values in 'worldcountriestotalco2_field_89' if needed

        // Loop through colors and add legend items
        for (let i = 0; i < grades.length; i++) {
            const from = grades[i];
            const to = grades[i + 1];

            div.innerHTML += `
                <div class="legend-item">
                    <div class="legend-color" style="background: ${colorScale[i]};"></div>
                    <div class="legend-label">${from}${to ? '&ndash;' + to : '+'}</div>
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
const getColor = (value, colorScale) => {
    // You can customize this function based on the range of values and the color scale you want
    // Example:
    const index = Math.floor(value); // Adjust index according to the range of values
    return colorScale[index];
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
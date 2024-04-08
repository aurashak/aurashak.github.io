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
fetch("https://aurashak.github.io/geojson/world/worldcountries.geojson")
  .then(response => response.json())
  .then(geojsonData => {
    console.log("GeoJSON data loaded successfully:", geojsonData);
    
    // Fetch the CSV file
    console.log("Fetching CSV file...");
    fetch("https://aurashak.github.io/projects/emissionsmap/data/EDGARv8_c02/GHG_totals_by_country-Table%201.csv")
      .then(response => response.text())
      .then(csvData => {
        console.log("CSV data loaded successfully:", csvData);
        
        // Parse the CSV data
        console.log("Parsing CSV data...");
        const csvRows = csvData.split('\n');
        const headers = csvRows[0].split(',');
        const countryIndex = headers.indexOf('Country');
        const data2022Index = headers.indexOf('2022');

        // Extract country names and corresponding data from CSV
        const csvDataArray = csvRows.slice(1).map(row => row.split(','));
        const csvCountries = csvDataArray.map(row => row[countryIndex]);
        const csvDataColumn = csvDataArray.map(row => parseFloat(row[data2022Index]));

        // Filter GeoJSON data based on matching country names
        console.log("Filtering GeoJSON data based on CSV countries...");
        const filteredFeatures = geojsonData.features.filter(feature => {
          return csvCountries.includes(feature.properties.NAME);
        });
        
        // Create a new GeoJSON object with filtered features
        const filteredGeoJSON = {
          type: "FeatureCollection",
          features: filteredFeatures
        };
        
        console.log("Filtered GeoJSON data:", filteredGeoJSON);
        
        // Now you can proceed to create the chloropleth map using filteredGeoJSON and csvDataColumn
        // Example code to create chloropleth map goes here
        // Define the color scale and map the values to colors
        const colorScale = chroma.scale(['#f7fbff', '#08519c']).mode('lab').colors(10);
        const geojsonLayer = L.geoJSON(filteredGeoJSON, {
            style: function(feature) {
                const countryName = feature.properties.NAME;
                const index = csvCountries.indexOf(countryName);
                if (index !== -1) {
                    const value = csvDataColumn[index];
                    const colorIndex = Math.floor((value / 15685) * 9);
                    return {
                        fillColor: colorScale[colorIndex],
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.7
                    };
                } else {
                    console.log("No data found for country:", countryName);
                    return {
                        fillColor: '#cccccc',
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.7
                    };
                }
            }
        }).addTo(map);
    })
      .catch(error => {
        console.error("Error loading CSV data:", error);
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
// Define the projection for the globe
var projection = d3.geoOrthographic()
    .scale(250) // Adjust the scale as needed
    .translate([400, 300]) // Adjust to center in your SVG container
    .clipAngle(90); // Limit displayed area to a hemisphere

// Create a path generator based on the projection
var pathGenerator = d3.geoPath().projection(projection);

// Load and process the GeoJSON data
d3.json("https://aurashak.github.io/geojson/countries.geojson").then(function(worldData) {
    // Select the SVG container
    var svg = d3.select(".globe-container");

    // Append a path for each country/feature in the GeoJSON data
    svg.selectAll("path")
       .data(worldData.features)  // Bind features to paths
       .enter().append("path")
       .attr("d", pathGenerator)  // Use the path generator to draw each path
       .attr("class", "country"); // Optional: Add a class for styling
});

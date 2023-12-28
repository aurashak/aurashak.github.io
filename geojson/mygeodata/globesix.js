// Set the dimensions of the canvas / graph
const width = 960, height = 500;

// Create the SVG container and set its size
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Define the projection for the globe
const projection = d3.geoOrthographic()
    .scale((height - 10) / 2)
    .translate([width / 2, height / 2])
    .clipAngle(90);

// Create a path generator for the projection
const path = d3.geoPath().projection(projection);

// Draw the ocean
svg.append("circle")
    .attr("class", "ocean")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale());

// Draw the graticule
const graticule = d3.geoGraticule();
svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

// Load and display the GeoJSON data
d3.json("https://aurashak.github.io/geojson/countries.geojson").then((geojson) => {
    svg.selectAll(".country")
        .data(geojson.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path);
});

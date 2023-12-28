const width = 960;
const height = 600;

// Define an orthographic projection
const projection = d3.geoOrthographic()
    .scale(290) // Adjusted scale to fit the SVG
    .translate([width / 2, height / 2])
    .clipAngle(90);
const path = d3.geoPath().projection(projection);

// Create SVG element
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "blue"); // Set ocean color directly on SVG

// Draw graticules
const graticule = d3.geoGraticule();
svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", "#ccc") // Set graticule line color
    .attr("stroke-width", 0.5);

// Load and display the world countries
d3.json("https://aurashak.github.io/geojson/world_countries_geojson.geojson").then((data) => {
    svg.selectAll(".country")
        .data(data.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", "grey") // Set country fill color
        .attr("stroke", "white") // Set country border color
        .attr("stroke-width", 0.7); // Increased stroke-width for visibility
});

// Load and display capitals
d3.json("https://aurashak.github.io/geojson/capitals.geojson").then((capitals) => {
    svg.selectAll(".capital")
        .data(capitals.features)
        .enter().append("circle")
        .attr("class", "capital")
        .attr("cx", d => projection(d.geometry.coordinates)[0])
        .attr("cy", d => projection(d.geometry.coordinates)[1])
        .attr("r", 1.5)
        .attr("fill", "red");
});

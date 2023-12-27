// Define the projection for the globe
var projection = d3.geoOrthographic()
    .scale(250)
    .translate([400, 300])
    .clipAngle(90);

// Create a path generator based on the projection
var pathGenerator = d3.geoPath().projection(projection);

// Select the SVG container
var svg = d3.select(".globe-container");

// Draw the sphere (ocean) and add a black border around the globe
svg.append("path")
   .datum({type: "Sphere"})
   .attr("class", "ocean")
   .attr("d", pathGenerator)
   .style("fill", "lightblue")
   .style("stroke", "black")
   .style("stroke-width", "0.5");

// Load and process the countries GeoJSON data
d3.json("https://aurashak.github.io/geojson/countries.geojson").then(function(worldData) {
    svg.selectAll("path.country")
       .data(worldData.features)
       .enter().append("path")
       .attr("d", pathGenerator)
       .attr("class", "country")
       .style("stroke", "black")
       .style("stroke-width", "0.8")
       .style("fill", "#ccc");

    // Load and process the capitals GeoJSON data
    d3.json("https://aurashak.github.io/geojson/capitals.geojson").then(function(capitalsData) {
        svg.selectAll("circle.capital")
           .data(capitalsData.features)
           .enter().append("circle")
           .attr("cx", function(d) { return projection(d.geometry.coordinates)[0]; })
           .attr("cy", function(d) { return projection(d.geometry.coordinates)[1]; })
           .attr("r", 3)
           .style("fill", "red");
    });

    // Define drag behavior
    var drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged);
    svg.call(drag);

    // Define zoom behavior
    var zoom = d3.zoom()
        .on("zoom", zoomed);
    svg.call(zoom);
});

// Drag and zoom functions
function dragstarted(event) {
    d3.select(this).raise().classed("active", true);
}
function dragged(event) {
    var rotate = projection.rotate();
    var k = sensitivity / projection.scale();
    projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
    svg.selectAll("path").attr("d", pathGenerator);
    svg.selectAll("circle.capital").attr("cx", function(d) { return projection(d.geometry.coordinates)[0]; })
        .attr("cy", function(d) { return projection(d.geometry.coordinates)[1]; });
}
function zoomed(event) {
    projection.scale(250 * event.transform.k);
    svg.selectAll("path").attr("d", pathGenerator);
    svg.selectAll("circle.capital").attr("cx", function(d) { return projection(d.geometry.coordinates)[0]; })
        .attr("cy", function(d) { return projection(d.geometry.coordinates)[1]; });
}

var sensitivity = 75;

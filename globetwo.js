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

// Define drag behavior
var drag = d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged);

// Apply drag behavior to the globe
svg.call(drag);

function dragStarted(event) {
    var [x, y] = d3.pointer(event);
    this.rotateStart = projection.rotate();
    this.pointStart = [x, y];
}

function dragged(event) {
    var [x, y] = d3.pointer(event);
    var pointEnd = [x, y];
    var rotateStart = this.rotateStart;
    
    var angle = d3.geoDistance(this.pointStart, pointEnd);
    var rotate = [
        rotateStart[0] + angle * (pointEnd[0] - this.pointStart[0]) / 5,
        rotateStart[1] - angle * (pointEnd[1] - this.pointStart[1]) / 5
    ];
    
    projection.rotate(rotate);
    svg.selectAll("path").attr("d", pathGenerator);
}

// Define zoom behavior
var zoom = d3.zoom()
    .scaleExtent([100, 800]) // Set the minimum and maximum scale
    .on("zoom", zoomed);

// Apply zoom behavior to the globe
svg.call(zoom);

function zoomed(event) {
    projection.scale(event.transform.k);
    svg.selectAll("path").attr("d", pathGenerator);
}

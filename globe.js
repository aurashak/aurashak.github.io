// Set up the SVG container
const width = 800;
const height = 600;

const svg = d3.select("#globe");

let projection; // Move projection to the global scope
let path;       // Move path to the global scope
let yaw = 0;
let pitch = 0;
let roll = 0;

// Variable to store click start position
let clickStart;

// Load the GeoJSON data
d3.json("https://aurashak.github.io/countries.geojson").then(function(data) {
  // Create a GeoJSON projection
  projection = d3.geoOrthographic()
    .fitSize([width, height], data)
    .precision(0.1);

  // Create a path generator
  path = d3.geoPath()
    .projection(projection);

  // Draw solid light blue sphere
  const blueSphere = svg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale())
    .attr("fill", "lightblue")
    .attr("stroke", "none");

  // Draw graticule sphere with dark grey lines
  const graticuleSphere = d3.geoGraticule()();
  const graticulePath = svg.append("path")
    .datum(graticuleSphere)
    .attr("fill", "none")
    .attr("stroke", "darkgrey") // Set the graticule color
    .attr("stroke-width", 0.5); // Set the graticule line width

  // Draw country outlines with grey fill
  const countries = svg.selectAll("path.country")
    .data(data.features)
    .enter().append("a") // Wrap each path in an anchor tag
      .attr("xlink:href", d => d.properties.name === "Angola" ? "https://example.com/angola" : null) // Set hyperlink for Angola
      .append("path")
      .attr("class", d => `country ${d.properties.name === "Angola" ? "angola" : ""}`) // Add the 'angola' class for Angola
      .attr("d", path)
      .attr("stroke", "black");

  // Add click and drag event listeners
  svg.call(d3.drag()
    .subject(dragSubject)
    .on("start", dragStart)
    .on("drag", dragging)
    .on("end", dragEnd));

  // Function to set the drag subject
  function dragSubject() {
    const rotation = projection.invert(d3.mouse(this));
    return { x: rotation[0], y: -rotation[1] };
  }

  // Function to handle drag start
  function dragStart() {
    clickStart = d3.mouse(this);
  }

  // Function to handle dragging
  function dragging() {
    const clickEnd = d3.mouse(this);
    const deltaX = clickEnd[0] - clickStart[0];
    const deltaY = clickEnd[1] - clickStart[1];

    yaw -= deltaX * 0.25;  // Adjust the rotation speed as needed
    pitch += deltaY * 0.25;

    clickStart = clickEnd;

    updateRotation();
  }

  // Function to handle drag end
  function dragEnd() {
    clickStart = null;
  }

  // Function to update globe rotation
  function updateRotation() {
    d3.transition()
      .duration(50)
      .tween("rotate", function() {
        const targetRotation = [yaw, pitch, roll];
        const r = d3.interpolate(projection.rotate(), targetRotation);
        return function(t) {
          projection.rotate(r(t));

          // Update blue sphere rotation
          blueSphere.attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", projection.scale());

          // Update graticule rotation
          graticulePath.attr("d", path)
            .attr("transform", `rotate(${yaw}, ${width / 2}, ${height / 2})`);

          // Update countries rotation
          countries.attr("d", path);
        };
      });
  }
}).catch(function(error) {
  console.error("Error loading GeoJSON data:", error);
});

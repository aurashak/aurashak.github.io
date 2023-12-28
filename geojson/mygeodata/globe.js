// Define the size of the globe
let width = 500;
let height = 500;

// Define the projection and path for the globe
let projection = d3.geoOrthographic()
  .scale(250)
  .center([0, 0])
  .rotate([0, -30])
  .translate([width / 2, height / 2]);

let context = d3.select('#globe').append('canvas')
  .attr('width', width)
  .attr('height', height)
  .node().getContext('2d');

let path = d3.geoPath(projection, context);

// Function to render the globe
function render(land) {
  context.clearRect(0, 0, width, height);
  context.beginPath();
  path(land);
  context.fill();
  context.stroke();
}

// Load and draw the world map
d3.json('https://aurashak.github.io/geojson/mygeodata/countries.topojson').then((world) => {
  let land = topojson.feature(world, world.objects.land);
  render(land);
});

// Add event listeners for drag behavior
// ...


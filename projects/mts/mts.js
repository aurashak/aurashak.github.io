mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';


var map = new mapboxgl.Map({
    container: 'mtsmap',
    zoom: 16, // Zoom in for a close-up view
    pitch: 75, // Adjust the pitch to a lower angle (e.g., 30 degrees)
    bearing: -260, // Set bearing for a view from the East Hudson River
    minZoom: 16,
    maxZoom: 20, // Limit the maximum zoom level
    style: 'mapbox://styles/mapbox/streets-v11', // You can use other map styles as well
    center: [-73.957611, 40.822583], // Centered around the West Side of Manhattan and the Hudson River
  });

// Add a variable to track label visibility
var labelsVisible = true;

// Add 3D building layer
map.on('load', function () {
  map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 14,
    'paint': {
      'fill-extrusion-color': '#aaa',
      'fill-extrusion-height': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'height'],
      ],
      'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'min_height'],
      ],
      'fill-extrusion-opacity': 0.6,
    },
  });
});

// Add a click event handler for the toggle button
document.getElementById('toggleLabelsButton').addEventListener('click', function () {
  if (labelsVisible) {
    // Hide labels
    map.setLayoutProperty('3d-buildings', 'visibility', 'none');
    labelsVisible = false;
  } else {
    // Show labels
    map.setLayoutProperty('3d-buildings', 'visibility', 'visible');
    labelsVisible = true;
  }
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());

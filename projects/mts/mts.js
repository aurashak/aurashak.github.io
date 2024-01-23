mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';



// Create a new Mapbox map instance
var map = new mapboxgl.Map({
    container: 'map', // HTML element ID where the map will be displayed
    style: 'mapbox://styles/mapbox/streets-v11', // Map style URL
    center: [-74.006, 40.7128], // Initial map center coordinates (longitude, latitude)
    zoom: 12 // Initial zoom level
});

// Add navigation control (zoom in/out buttons)
map.addControl(new mapboxgl.NavigationControl());

// Add a marker to the map
var marker = new mapboxgl.Marker()
    .setLngLat([-74.006, 40.7128]) // Marker coordinates (longitude, latitude)
    .addTo(map);
mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

var map = new mapboxgl.Map({
    container: 'mtsmap',
    zoom: 16,
    pitch: 75,
    bearing: -260,
    minZoom: 16,
    maxZoom: 20,
    style: 'mapbox://styles/mapbox/streets-v11', // Map style URL
    center: [-73.957611, 40.822583],
});




    
    // Add navigation control (zoom in/out buttons)
    map.addControl(new mapboxgl.NavigationControl());
    
    // Add a marker to the map
    var marker = new mapboxgl.Marker()
        .setLngLat([-74.006, 40.7128]) // Marker coordinates (longitude, latitude)
        .addTo(map);
    
        





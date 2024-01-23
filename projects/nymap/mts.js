mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';


var map = new mapboxgl.Map({
    container: 'mtsmap',
    zoom: 16,
    pitch: 75,
    bearing: -260,
    minZoom: 15,
    maxZoom: 20,
    style: 'mapbox://styles/mapbox/light-v10', // Use any base style you prefer
    center: [-73.957611, 40.822583],
});

// Define the bounds as an array of coordinates [southwest, northeast]
var bounds = [
    [-73.959, 40.821], // Southwest corner
    [-73.956, 40.824]  // Northeast corner
];



// Add 3D buildings layer
map.on('load', function () {
    map.addSource('nyc-buildings', {
        'type': 'vector',
        'url': 'mapbox://mapbox.mapbox-streets-v8'
    });
    
    map.addLayer({
        'id': '3d-buildings',
        'source': 'nyc-buildings',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': {
                'type': 'identity',
                'property': 'height'
            },
            'fill-extrusion-base': {
                'type': 'identity',
                'property': 'min_height'
            },
            'fill-extrusion-opacity': 0.6
        }
    });
    
    // Add navigation control (zoom in/out buttons)
    map.addControl(new mapboxgl.NavigationControl());

  
});

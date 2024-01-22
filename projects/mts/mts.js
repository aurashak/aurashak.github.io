mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

const map = new mapboxgl.Map({
    container: 'mtsmap',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-73.954, 40.812], // Centered around the West Side of Manhattan and the Hudson River
    zoom: 70, // Zoom in for a close-up view
    pitch: 45, // Set pitch to 45 for a 3D perspective
    bearing: -150, // Set bearing for a view from the East Hudson River
    maxBounds: [
        [-74.0479, 40.7074], // Lower Manhattan's southwest corner
        [-73.9667, 40.8876]  // Upper Manhattan's northeast corner
    ],
    maxZoom: 13, // Limit the maximum zoom level
});

// Add 3D building layer
map.on('load', () => {
    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6,
        },
    });
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());

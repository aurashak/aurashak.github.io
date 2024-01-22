mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

const map = new mapboxgl.Map({
    container: 'mtsmap',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-73.9529, 40.8116], // Centered around 125th Street
    zoom: 6, // Closer zoom level
    pitch: 0, // Set pitch to 0 for a flat perspective (facing east)
    bearing: 0, // Set bearing to 0 for no rotation
    maxBounds: [
        [-74.0479, 40.7876], // Upper Manhattan's southwest corner
        [-73.9107, 40.8692]  // Upper Manhattan's northeast corner
    ],
    maxZoom: 11, // Limit the maximum zoom level
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

mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

const map = new mapboxgl.Map({
    container: 'mtsmap',
    style: 'mapbox://styles/mapbox/streets-v11',
    bounds: [
        [-74.0479, 40.7876], // Upper Manhattan's southwest corner
        [-73.9107, 40.8692]  // Upper Manhattan's northeast corner
    ],
    pitch: 45, // Set pitch to view in 3D
    bearing: -90, // Set bearing to view from west to east
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

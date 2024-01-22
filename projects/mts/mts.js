mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

var map = new mapboxgl.Map({
    container: 'mtsmap',
    zoom: 16,
    pitch: 75,
    bearing: -260,
    minZoom: 16,
    maxZoom: 20,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-73.957611, 40.822583],
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

    // Add labels layer
    map.addLayer({
        'id': 'labels',
        'type': 'symbol',
        'source': 'composite',
        'layout': {
            'visibility': labelsVisible ? 'visible' : 'none', // Initial label visibility
            'text-field': ['get', 'name'], // You can customize this to show different labels
            'text-size': 12,
        },
        'source-layer': 'place-label', // Specify the source-layer for labels
    });
});

// Add a click event handler for the toggle button
document.getElementById('toggleLabelsButton').addEventListener('click', function () {
    if (labelsVisible) {
        // Hide labels
        map.setLayoutProperty('labels', 'visibility', 'none');
        labelsVisible = false;
    } else {
        // Show labels
        map.setLayoutProperty('labels', 'visibility', 'visible');
        labelsVisible = true;
    }
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());

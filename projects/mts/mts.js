mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

const map = new mapboxgl.Map({
    container: 'mtsmap',
    style: {
        version: 8,
        sources: {
            'streets': {
                type: 'vector',
                url: 'mapbox://mapbox.mapbox-streets-v8',
            },
            'buildings': {
                type: 'vector',
                url: 'mapbox://mapbox.mapbox-streets-v8',
            },
        },
        layers: [
            {
                id: 'buildings-layer',
                type: 'fill-extrusion',
                source: 'buildings',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                minzoom: 15,
                paint: {
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'min_height'],
                    'fill-extrusion-opacity': 0.6,
                },
            },
        ],
    },
    center: [-73.954, 40.812], // Centered around the West Side of Manhattan and the Hudson River
    zoom: 18, // Zoom in for a close-up view
    pitch: 45, // Set pitch to 45 for a 3D perspective
    bearing: -260, // Set bearing for a view from the East Hudson River
    minZoom: 17,
    maxZoom: 20, // Limit the maximum zoom level
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());


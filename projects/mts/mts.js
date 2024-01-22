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
            'water': {
                type: 'vector',
                url: 'mapbox://mapbox.mapbox-streets-v8',
            },
            'parks': {
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
            {
                id: 'water-layer',
                type: 'fill',
                source: 'water',
                'source-layer': 'water',
                paint: {
                    'fill-color': '#4D90D1',
                },
            },
            {
                id: 'parks-layer',
                type: 'fill',
                source: 'parks',
                'source-layer': 'park',
                paint: {
                    'fill-color': '#8CC084',
                },
            },
        ],
    },
    center: [-73.957611, 40.822583], // Centered around the West Side of Manhattan and the Hudson River
    zoom: 16, // Zoom in for a close-up view
    pitch: 75, // Adjust the pitch to a lower angle (e.g., 30 degrees)
    bearing: -260, // Set bearing for a view from the East Hudson River
    minZoom: 16,
    maxZoom: 20, // Limit the maximum zoom level
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());


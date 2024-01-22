mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

// Define the building layer source and layer
const buildingLayer = {
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
};

// Define sources and layers for your default style
const defaultStyle = {
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
    },
    layers: [
        {
            id: 'streets-layer',
            type: 'line',
            source: 'streets',
            'source-layer': 'road',
            paint: {
                'line-color': '#888',
                'line-width': 2,
            },
        },
        // Include the building layer here
        buildingLayer,
        {
            id: 'water-layer',
            type: 'fill',
            source: 'water',
            'source-layer': 'water',
            paint: {
                'fill-color': '#4D90D1',
            },
        },
    ],
};

// Initialize the map with the default style
const map = new mapboxgl.Map({
    container: 'mtsmap',
    style: defaultStyle,
    center: [-73.957611, 40.822583], // Centered around the West Side of Manhattan and the Hudson River
    zoom: 16, // Zoom in for a close-up view
    pitch: 75, // Adjust the pitch to a lower angle (e.g., 30 degrees)
    bearing: -260, // Set bearing for a view from the East Hudson River
    minZoom: 16,
    maxZoom: 20, // Limit the maximum zoom level
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());

// Add event listener for the Satellite toggle button
document.getElementById('satelliteToggle').addEventListener('change', function() {
    if (this.checked) {
        // Set the map style to the Satellite imagery
        map.setStyle('mapbox://styles/mapbox/satellite-v9');
    } else {
        // Set the map style back to the default style
        map.setStyle(defaultStyle);
    }
});

// Add event listener for the OSM toggle button
document.getElementById('osmToggle').addEventListener('change', function() {
    if (this.checked) {
        // Set the map style to OpenStreetMap
        map.setStyle('mapbox://styles/mapbox/streets-v11');
    } else {
        // Set the map style back to the default style
        map.setStyle(defaultStyle);
    }
});

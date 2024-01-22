mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

// Initialize the map with your default style
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
            // ... (your existing layers) ...
        ],
    },
    center: [-73.957611, 40.822583], // Centered around the West Side of Manhattan and the Hudson River
    zoom: 16, // Zoom in for a close-up view
    pitch: 75, // Adjust the pitch to a lower angle (e.g., 30 degrees)
    bearing: -260, // Set bearing for a view from the East Hudson River
    minZoom: 16,
    maxZoom: 20, // Limit the maximum zoom level
});

// Function to toggle between map styles
function toggleMapStyle(style) {
    map.setStyle(style);
}

// Add event listener for the OSM toggle button
document.getElementById('osmToggle').addEventListener('change', function() {
    if (this.checked) {
        // Set the map style to OpenStreetMap
        toggleMapStyle('mapbox://styles/mapbox/streets-v11');
    } else {
        // Set the map style to your default style
        toggleMapStyle({
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
                // ... (your existing layers) ...
            ],
        });
    }
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());

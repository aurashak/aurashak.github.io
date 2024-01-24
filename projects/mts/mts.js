mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

var map = new mapboxgl.Map({
    container: 'mtsmap',
    zoom: 16,
    pitch: 75,
    bearing: -260,
    minZoom: 15,
    maxZoom: 20,
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-73.957611, 40.822583],
});

// Define the bounds as an array of coordinates [southwest, northeast]
var bounds = [
    [-74.064, 40.766], // Southwest corner with larger expansion
    [-73.837, 40.928]  // Northeast corner with larger expansion
];

// Set the maximum bounds for the map
map.setMaxBounds(bounds);

// Wait for the style to load before adding sources and layers
map.on('style.load', function () {

    // Add a GeoJSON source to the map for 100-year floodplain
    map.addSource('100yearfloodplain-source', {
        type: 'geojson',
        data: 'https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson'
    });

    // Add a layer for the polygon for 100-year floodplain
    map.addLayer({
        id: '100yearfloodplain-polygon-layer',
        type: 'fill',
        source: '100yearfloodplain-source',
        paint: {
            'fill-color': 'blue',
            'fill-opacity': 0.5
        },
        layout: {
            'visibility': 'none' // Initially set to none
        }
    });


    // Add 3D buildings layer (Keep this layer always visible)
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
            'fill-extrusion-opacity': 1
        },
        layout: {
            'visibility': 'visible' // Always visible
        }
    });




    // Add a GeoJSON source to the map for wastewater treatment
    map.addSource('wastewatertreatment-source', {
        type: 'geojson',
        data: 'https://aurashak.github.io/geojson/nyc/wastewatertreatment.geojson'
    });

    // Add a layer for brown circle markers for wastewater treatment
    map.addLayer({
        id: 'wastewatertreatment-circle-layer',
        type: 'circle',
        source: 'wastewatertreatment-source',
        paint: {
            'circle-radius': 15,
            'circle-color': 'red',
            'circle-opacity': 0.8
        },
        layout: {
            'visibility': 'none' // Initially set to none
        }
    });

    // Add a GeoJSON source to the map for AQI sites
    map.addSource('aqisite-source', {
        type: 'geojson',
        data: 'https://aurashak.github.io/geojson/nyc/aqisite.geojson'
    });

    // Add a layer for brown circle markers for AQI sites
    map.addLayer({
        id: 'aqisite-circle-layer',
        type: 'circle',
        source: 'aqisite-source',
        paint: {
            'circle-radius': 12,
            'circle-color': 'green',
            'circle-opacity': 0.8
        },
        layout: {
            'visibility': 'none' // Initially set to none
        }
    });

    // Add a GeoJSON source to the map for gas pipelines
    map.addSource('nygaspipelines', {
        type: 'geojson',
        data: 'https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson'
    });

    // Add a layer for brown gas pipelines
    map.addLayer({
        'id': 'nygaspipelines-layer',
        'type': 'line',
        'source': 'nygaspipelines',
        'paint': {
            'line-color': 'brown',
            'line-width': 10,
            'line-opacity': 0.8
        },
        layout: {
            'visibility': 'none' // Initially set to none
        }
    });

    // Add a GeoJSON source to the map for NYC SO
    map.addSource('nycso-source', {
        type: 'geojson',
        data: 'https://aurashak.github.io/geojson/nyc/nycso.geojson'
    });

    // Add a layer for brown circle markers for NYC SO
    map.addLayer({
        id: 'nycso-circle-layer',
        type: 'circle',
        source: 'nycso-source',
        paint: {
            'circle-radius': 10,
            'circle-color': 'brown',
            'circle-opacity': 0.8
        },
        layout: {
            'visibility': 'none' // Initially set to none
        }
    });

    
    // Function to toggle layer visibility based on switch state
    function toggleLayer(layerId, isChecked) {
        if (isChecked) {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        } else {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
    }

    // Initialize the switches to the "off" position for all layers except 3D buildings
    document.getElementById('100yearfloodplain-switch').checked = false;
    document.getElementById('wastewatertreatment-switch').checked = false;
    document.getElementById('aqisite-switch').checked = false;
    document.getElementById('nygaspipelines-switch').checked = false;
    document.getElementById('nycso-switch').checked = false;

    // Add event listeners to switches
    document.getElementById('100yearfloodplain-switch').addEventListener('change', function () {
        toggleLayer('100yearfloodplain-polygon-layer', this.checked);
    });

    document.getElementById('wastewatertreatment-switch').addEventListener('change', function () {
        toggleLayer('wastewatertreatment-circle-layer', this.checked);
    });

    document.getElementById('aqisite-switch').addEventListener('change', function () {
        toggleLayer('aqisite-circle-layer', this.checked);
    });

    document.getElementById('nygaspipelines-switch').addEventListener('change', function () {
        toggleLayer('nygaspipelines-layer', this.checked);
    });

    document.getElementById('nycso-switch').addEventListener('change', function () {
        toggleLayer('nycso-circle-layer', this.checked);
    });

    // Add navigation control (zoom in/out buttons)
    map.addControl(new mapboxgl.NavigationControl());
});


// Call createLegendSymbol function for each layer
createLegendSymbol('wastewatertreatment-circle-layer', 'legend-wastewatertreatment');
createLegendSymbol('aqisite-circle-layer', 'legend-aqisite');
createLegendSymbol('100yearfloodplain-polygon-layer', 'legend-100yearfloodplain');
createLegendSymbol('nygaspipelines-layer', 'legend-nygaspipelines');
createLegendSymbol('nycso-circle-layer', 'legend-nycso');


// Function to create legend symbols based on layer styling
function createLegendSymbol(layerId, legendId) {
    const layer = map.getLayer(layerId);

    if (layer && layer.type === 'circle') {
        const color = layer.paint['circle-color'];
        if (color) {
            document.getElementById(legendId).style.background = color;
        }
    } else if (layer && layer.type === 'fill') {
        const color = layer.paint['fill-color'];
        if (color) {
            document.getElementById(legendId).style.background = color;
        }
    } else if (layer && layer.type === 'line') {
        const color = layer.paint['line-color'];
        if (color) {
            document.getElementById(legendId).style.background = color;
        }
    }
}


// Add compass control
map.addControl(new mapboxgl.CompassControl(), 'top-left');


// Add scale bar
map.on('move', updateScale);

function updateScale() {
    const maxWidth = 100; // Maximum width in pixels for the scale bar
    const metersPerPixel = (Math.cos((map.getCenter().lat * Math.PI) / 180) * 2 * Math.PI * 6371000) / Math.pow(2, map.getZoom() + 8);

    const width = Math.min(maxWidth, metersPerPixel * map.getCanvas().width);
    const scale = metersPerPixel < 1 ? ' meters' : ' km';

    document.getElementById('scale').innerHTML = width.toFixed() + scale;
}

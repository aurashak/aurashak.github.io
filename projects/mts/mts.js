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

// Add water layer
map.addSource('water-source', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-streets-v8',
    'tiles': [
        'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/1/0/0.vector.pbf',
        'https://b.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/1/0/0.vector.pbf',
        'https://c.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/1/0/0.vector.pbf',
        'https://d.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/1/0/0.vector.pbf'
    ]
});

map.addLayer({
    'id': 'water-layer',
    'source': 'water-source',
    'source-layer': 'water',
    'type': 'fill',
    'paint': {
        'fill-color': '#ADD8E6',
        'fill-opacity': 0.7
    }
});

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
            'circle-opacity': 0.7
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
            'circle-opacity': 0.7
        }
    });

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
            'fill-opacity': 0.7
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
            'line-opacity': 0.7
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
            'circle-opacity': 0.7
        }
    });

    // Add navigation control (zoom in/out buttons)
    map.addControl(new mapboxgl.NavigationControl());
});

mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';


var map = new mapboxgl.Map({
    container: 'mtsmap',
    zoom: 16,
    pitch: 75,
    bearing: -260,
    minZoom: 15,
    maxZoom: 20,
    style: 'mapbox://styles/mapbox/light-v10', // Use any base style you prefer
    center: [-73.957611, 40.822583],
});

// Define the bounds as an array of coordinates [southwest, northeast]
var bounds = [
    [-74.064, 40.766], // Southwest corner with larger expansion
    [-73.837, 40.928]  // Northeast corner with larger expansion
];

// Set the maximum bounds for the map
map.setMaxBounds(bounds);


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
    




    // Add a GeoJSON source to the map
map.addSource('nycso-source', {
    type: 'geojson',
    data: 'https://aurashak.github.io/geojson/nyc/nycso.geojson'
});

// Add a layer for brown circle markers
map.addLayer({
    id: 'nycso-circle-layer',
    type: 'circle',
    source: 'nycso-source',
    paint: {
        'circle-radius': 10, // Adjust the circle radius as needed
        'circle-color': 'brown', // Set the circle color to brown
        'circle-opacity': 0.7
    }
});

map.addSource('nygaspipelines', {
    type: 'geojson',
    data: 'https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson'
});

map.addLayer({
    'id': 'nygaspipelines-layer',
    'type': 'line', // Change to 'line' for a line
    'source': 'nygaspipelines',
    'paint': {
        'line-color': 'brown', // Set line color
        'line-width': 10, // Set line width as needed
        'line-opacity': 0.7
    }
});


    // Add a GeoJSON source to the map
    map.addSource('wastewatertreatment-source', {
        type: 'geojson',
        data: 'https://aurashak.github.io/geojson/nyc/wastewatertreatment.geojson'
    });
    
    // Add a layer for brown circle markers
    map.addLayer({
        id: 'wastewatertreatment-circle-layer',
        type: 'circle',
        source: 'wastewatertreatment-source',
        paint: {
            'circle-radius': 15, // Adjust the circle radius as needed
            'circle-color': 'red', // Set the circle color to brown
            'circle-opacity': 0.7
        }
    });


        // Add a GeoJSON source to the map
        map.addSource('aqisite-source', {
            type: 'geojson',
            data: 'https://aurashak.github.io/geojson/nyc/aqisite.geojson'
        });
        
        // Add a layer for brown circle markers
        map.addLayer({
            id: 'aqisite-circle-layer',
            type: 'circle',
            source: 'aqisite-source',
            paint: {
                'circle-radius': 12, // Adjust the circle radius as needed
                'circle-color': 'green', // Set the circle color to brown
                'circle-opacity': 0.7
            }
        });
    
// Add a GeoJSON source to the map
map.addSource('100yearfloodplain-source', {
    type: 'geojson',
    data: 'https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson'
});

// Add a layer for the polygon
map.addLayer({
    id: '100yearfloodplain-polygon-layer',
    type: 'fill', // Use 'fill' for polygons
    source: '100yearfloodplain-source',
    paint: {
        'fill-color': 'green', // Set the polygon fill color to green
        'fill-opacity': 0.7
    }
});


        


    // Add navigation control (zoom in/out buttons)
    map.addControl(new mapboxgl.NavigationControl());

  
});

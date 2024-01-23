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
    [-73.964, 40.816], // Southwest corner with a slight expansion
    [-73.951, 40.828]  // Northeast corner with a slight expansion
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
    



// Add a single layer
map.on('load', function () {
    // Add nycso layer
    map.addSource('nycso', {
        type: 'geojson',
        data: 'https://aurashak.github.io/geojson/nyc/nycso.geojson'
    });

    map.addLayer({
        'id': 'nycso-layer',
        'type': 'circle',
        'source': 'nycso',
        'paint': {
            'circle-color': 'brown',
            'circle-radius': 6,
            'circle-opacity': 0.7
        }
    });

// Add nygaspipelines layer as a line
map.addSource('nygaspipelines', {
    type: 'geojson',
    data: 'https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson'
});

map.addLayer({
    'id': 'nygaspipelines-layer',
    'type': 'line', // Change to 'line' to display as a line
    'source': 'nygaspipelines',
    'paint': {
        'line-color': 'purple', // Set line color to brown
        'line-width': 2, // Set line width as needed
        'line-opacity': 0.7
    }
});


    // Add nycwaste layer
    map.addSource('nycwaste', {
        type: 'geojson',
        data: 'https://aurashak.github.io/geojson/nyc/nycwaste.geojson'
    });

    map.addLayer({
        'id': 'nycwaste-layer',
        'type': 'circle',
        'source': 'nycwaste',
        'paint': {
            'circle-color': 'orange',
            'circle-radius': 6,
            'circle-opacity': 0.7
        }
    });

    // Add wastewatertreatment layer
    map.addSource('wastewatertreatment', {
        type: 'geojson',
        data: 'https://aurashak.github.io/geojson/nyc/wastewatertreatment.geojson'
    });

    map.addLayer({
        'id': 'wastewatertreatment-layer',
        'type': 'circle',
        'source': 'wastewatertreatment',
        'paint': {
            'circle-color': 'red',
            'circle-radius': 6,
            'circle-opacity': 0.7
        }
    });

    // Add wastetransferfacility layer
    map.addSource('wastetransferfacility', {
        type: 'geojson',
        data: 'https://aurashak.github.io/geojson/nyc/wastetransferfacility.geojson'
    });

    map.addLayer({
        'id': 'wastetransferfacility-layer',
        'type': 'circle',
        'source': 'wastetransferfacility',
        'paint': {
            'circle-color': 'yellow',
            'circle-radius': 6,
            'circle-opacity': 0.7
        }
    });




});



    // Add navigation control (zoom in/out buttons)
    map.addControl(new mapboxgl.NavigationControl());

  
});

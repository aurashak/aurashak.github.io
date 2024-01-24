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
        }
    });




// Add the GeoJSON source for 3D buildings
map.addSource('buildings', {
    type: 'geojson',
    data: 'https://aurashak.github.io/geojson/nyc/mtszoning.geojson',
});

// Add a layer for 3D buildings
map.addLayer({
    id: '3d-buildings',
    source: 'buildings',
    type: 'fill-extrusion',
    minzoom: 14,
    paint: {
        'fill-extrusion-color': [
            'match',
            ['get', 'overlay'], // Property containing zoning classification
            'C2-5', '#ff0000', // Color for C2-5 zoning class
            'R2', '#00ff00',   // Color for R2 zoning class
            'R3', '#0000ff',   // Color for R3 zoning class
            'default-color',   // Default color for other zoning classes
        ],
        'fill-extrusion-height': 100, // Adjust the height as needed
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.6,
    },
});

// Get the unique values of the "overlay" property from the GeoJSON data
var uniqueOverlays = [...new Set(map.getSource('buildings')._data.features.map(feature => feature.properties.overlay))];

// Create a legend (optional)
var legend = document.getElementById('legend');

uniqueOverlays.forEach(function (overlay) {
    // You can assign colors to each zoning district as desired
    var color = getRandomColor(); // Replace this with your color logic

    var item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = '<span class="legend-color" style="background: ' + color + '"></span>' + overlay;
    legend.appendChild(item);
});



// Function to generate random colors (you can replace this with your color logic)
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

    // Update the map with new data (optional)
    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['3d-buildings'],
        });

        if (!features.length) {
            return;
        }

        var zoningClassification = features[0].properties.overlay;
        // You can use zoningClassification for further actions or display
        console.log('Zoning Classification:', zoningClassification);
    });
});




// Function to toggle layer visibility based on switch state
function toggleLayer(layerId, isChecked) {
    if (isChecked) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
    } else {
        map.setLayoutProperty(layerId, 'visibility', 'none');
    }
}


        // Function to toggle layer visibility based on switch state
        function toggleLayer(layerId, isChecked) {
            if (isChecked) {
                map.setLayoutProperty(layerId, 'visibility', 'visible');
            } else {
                map.setLayoutProperty(layerId, 'visibility', 'none');
            }
        }
    
        // Add event listeners to switches
        document.getElementById('wastewatertreatment-switch').addEventListener('change', function () {
            toggleLayer('wastewatertreatment-circle-layer', this.checked);
        });
    
        document.getElementById('aqisite-switch').addEventListener('change', function () {
            toggleLayer('aqisite-circle-layer', this.checked);
        });
    
        document.getElementById('100yearfloodplain-switch').addEventListener('change', function () {
            toggleLayer('100yearfloodplain-polygon-layer', this.checked);
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

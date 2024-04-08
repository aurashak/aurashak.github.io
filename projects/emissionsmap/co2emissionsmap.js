mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

const map = new mapboxgl.Map({
    container: 'emissionsmap',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [0, 0], // Center coordinates to focus on the world
    zoom: 2, // Adjusted to a higher zoom level
    minZoom: 2, // Minimum zoom level
    maxZoom: 10, // Maximum zoom level
    pitch: 0,
    bearing: 0
});

// Add custom Robinson projection
map.on('style.load', function () {
    map.setProjection({
        name: 'robinson',
        to: function (coordinates) {
            return {
                lng: coordinates[0] / 180 * Math.PI,
                lat: coordinates[1] / 180 * Math.PI
            };
        },
        from: function (coordinates) {
            return [
                coordinates.lng / Math.PI * 180,
                coordinates.lat / Math.PI * 180
            ];
        }
    });
});

// Load GeoJSON data
map.on('load', function () {
    map.addSource('emissions-data', {
        type: 'geojson',
        data: 'https://aurashak.github.io/projects/emissionsmap/data/worldco2total.geojson'
    });

    // Create a choropleth map layer
    map.addLayer({
        id: 'emissions-layer',
        type: 'fill',
        source: 'emissions-data',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', '2022'],
                0,
                'white',
                100,
                'red',
                3000,
                'red',
                6000,
                'red',
                9000,
                'red',
                12000,
                'red',
                17000,
                'red'
            ],
            'fill-opacity': 0.8
        }
    });

    // Add tooltip on mouse hover
    map.on('mouseenter', 'emissions-layer', function (e) {
        const name = e.features[0].properties.NAME;
        const emissions = e.features[0].properties['2022'];

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<b>${name}</b><br>Emissions: ${emissions}`)
            .addTo(map);
    });

    // Remove tooltip on mouse leave
    map.on('mouseleave', 'emissions-layer', function () {
        map.getCanvas().style.cursor = '';
        map.closePopup();
    });

    // Add map controls
    map.addControl(new mapboxgl.NavigationControl());
});

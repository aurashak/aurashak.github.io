Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmE0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer1', {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    skyBox: false,
    fullscreenButton: false,
    animation: false,
    shouldAnimate: true,
});

viewer.scene.backgroundColor = Cesium.Color.WHITE;
viewer.scene.globe.backgroundColor = Cesium.Color.WHITE;

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
    }
});

viewer.camera.percentageChanged = 0.01;

var spinRate = Cesium.Math.toRadians(0.2);

function rotateGlobe() {
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, spinRate);
    requestAnimationFrame(rotateGlobe);
}

rotateGlobe();

var osmLayerVisible = true;
var sentinelLayerVisible = true;

// Load an array of GeoJSON files containing country boundaries
var countryBoundariesGeojsonUrls = [
    'https://aurashak.github.io/geojson/world/africa.json',
    'https://aurashak.github.io/geojson/world/europe.json',
    'https://aurashak.github.io/geojson/world/asia.json',
    'https://aurashak.github.io/geojson/world/northamerica.json',
    'https://aurashak.github.io/geojson/world/southamerica.json',
    'https://aurashak.github.io/geojson/world/oceana.json'
];

// Create an array of country entities from the GeoJSON data
var countryEntities = [];

// Load and process each GeoJSON file sequentially
function loadCountryBoundaries(index) {
    if (index < countryBoundariesGeojsonUrls.length) {
        Cesium.GeoJsonDataSource.load(countryBoundariesGeojsonUrls[index]).then(function (dataSource) {
            viewer.dataSources.add(dataSource);

            dataSource.entities.values.forEach(function (entity) {
                entity.polygon.outline = true;
                entity.polygon.outlineColor = Cesium.Color.RED;
                entity.polygon.outlineWidth = 2.0;

                // Adjust the extrudedHeight to make the countries visible over the satellite layer
                entity.polygon.extrudedHeight = 100000; // Adjust this height as needed

                entity.polygon.material = Cesium.Color.TRANSPARENT;
                countryEntities.push(entity);
            });

            // Schedule the loading of the next GeoJSON file
            loadCountryBoundaries(index + 1);
        }).otherwise(function (error) {
            console.error('Error loading GeoJSON data:', error);
        });
    } else {
        // All GeoJSON files have been loaded, start the animation loop
        animateCountryBoundaries(0);
    }
}

// Start loading the GeoJSON files
loadCountryBoundaries(0);

var currentIndex = 0;

function animateCountryBoundaries(index) {
    if (index < countryEntities.length) {
        // Hide all countries except the current one
        countryEntities.forEach(function (country, i) {
            country.show = (i === index);
        });

        currentIndex = index;

        // Schedule the next animation frame
        setTimeout(function () {
            animateCountryBoundaries((index + 1) % countryEntities.length);
        }, 2000); // Adjust the interval as needed
    }
}

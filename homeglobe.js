
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

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

// Load the GeoJSON file containing country boundaries
var countryBoundariesGeojsonUrl = 'https://aurashak.github.io/geojson/world/africa.json';

// Create an array of country entities from the GeoJSON data
var countryEntities = [];

Cesium.GeoJsonDataSource.load(countryBoundariesGeojsonUrl).then(function (dataSource) {
    viewer.dataSources.add(dataSource);

    dataSource.entities.values.forEach(function (entity) {
        entity.polygon.outline = true;
        entity.polygon.outlineColor = Cesium.Color.BLACK;
        entity.polygon.outlineWidth = 2.0;
        
        // Adjust the extrudedHeight to make the countries visible over the satellite layer
        entity.polygon.extrudedHeight = 100000; // Adjust this height as needed
        
        entity.polygon.material = Cesium.Color.TRANSPARENT;
        countryEntities.push(entity);
    });

    var currentIndex = 0;

    function animateCountryBoundaries() {
        if (currentIndex < countryEntities.length) {
            // Hide all countries except the current one
            countryEntities.forEach(function (country, index) {
                country.show = (index === currentIndex);
            });

            currentIndex++;

            // Schedule the next animation frame
            setTimeout(animateCountryBoundaries, 2000); // Adjust the interval as needed
        }
    }

    animateCountryBoundaries(); // Start the animation loop
}).otherwise(function (error) {
    console.error('Error loading GeoJSON data:', error);
});


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
    fullscreenButton: false,
    animation: false,
    skyBox: false, // Disable the skybox
    skyAtmosphere: false, // Disable the sky atmosphere
    backgroundColor: Cesium.Color.WHITE // Set the background color to white
});


viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
    }
});

viewer.camera.percentageChanged = 0.01;

var spinRate = 0.0003;
var isRotating = true;

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

var sentinelLayerVisible = true;

// Function to add the GeoJSON layer to the globe
function addGeoJsonLayer() {
    var dataSourcePromise = Cesium.GeoJsonDataSource.load('https://aurashak.github.io/geojson/world/cities.geojson');
    dataSourcePromise.then(function(dataSource) {
        viewer.dataSources.add(dataSource);

        // Adjust the appearance and style of the GeoJSON entities if needed
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            entity.point = new Cesium.PointGraphics({
                pixelSize: 10,
                color: Cesium.Color.RED
            });
        }
    }).otherwise(function(error) {
        console.error(error);
    });
}

// Call the function to add the GeoJSON layer
addGeoJsonLayer();
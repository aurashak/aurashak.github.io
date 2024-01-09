Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

// Create the viewer with the satellite imagery and disable unwanted widgets
var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.IonImageryProvider({ assetId: 3954 }), // Satellite imagery
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false
});

// Set the initial view
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 1500000), // Longitude, Latitude, Height in meters
    orientation: {
        heading: Cesium.Math.toRadians(0.0), // East, default value is 0.0 (north)
        pitch: Cesium.Math.toRadians(-90), // Downward tilt of the camera
        roll: 0.0
    }
});

// Enable slow rotation of the globe
viewer.clock.multiplier = 30; // Adjust the speed of time (the higher, the faster)
viewer.scene.preRender.addEventListener(function() {
    var spinRate = 0.0005;
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * viewer.clock.multiplier);
});
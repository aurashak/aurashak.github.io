Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmE0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer', {
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
    skyBox: false, // Remove the skybox
    skyAtmosphere: false, // Remove the atmosphere
    scene3DOnly: true, // Set 3D scene mode
    backgroundColor: Cesium.Color.WHITE // Set background color to white
});

viewer.scene.backgroundColor = Cesium.Color.WHITE;
viewer.scene.globe.backgroundColor = Cesium.Color.WHITE;

viewer.imageryLayers.get(0).brightness = 1.2;
viewer.imageryLayers.get(0).contrast = 1.2;

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
    }
});

viewer.camera.percentageChanged = 0.01; // Adjust this threshold as needed

var spinRate = Cesium.Math.toRadians(0.05); // Angular velocity in radians per frame

// Function to continuously rotate the globe
function rotateGlobe() {
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, spinRate);
    // Request the next frame
    Cesium.requestAnimationFrame(rotateGlobe);
}

// Start the rotation when the viewer is ready
viewer.scene.preRender.addEventListener(rotateGlobe);

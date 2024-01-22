
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
    shouldAnimate: true, // You can keep animation true if needed
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


viewer.camera.percentageChanged = 0.01; // Adjust this threshold as needed


// Function to rotate the globe automatically
function rotateGlobe() {
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, spinRate);
}

// Set the rotation speed
var spinRate = Cesium.Math.toRadians(0.2); // Adjust the speed as needed

// Start automatic rotation
rotateGlobe();

function toggleRotation() {
    isRotating = !isRotating;
    if (isRotating) {
        rotateGlobe();
    }
}

// Add an event listener to toggle rotation when clicking on the canvas
handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function() {
    toggleRotation();
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Define variables to keep track of layer visibility
var osmLayerVisible = true; // OpenStreetMap
var sentinelLayerVisible = true; // Sentinel-2

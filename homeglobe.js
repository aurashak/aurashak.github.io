Cesium.Ion.defaultAccessToken = 'your_access_token_here';

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
    animation: false
});

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

// Slow down the rotation
var spinRate = 0.0003;
var isRotating = true; // To keep track of the rotation state

// Function to rotate the globe slowly
function rotateGlobe() {
    if (isRotating) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
    }
}

// Call the rotateGlobe function periodically to create the rotation effect
viewer.clock.onTick.addEventListener(rotateGlobe);

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);


// Function to stop the rotation
function stopRotation() {
    isRotating = false;
}

// Add a click event listener to the Cesium canvas to stop rotation on click
handler.setInputAction(stopRotation, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Your other event handlers and code can remain unchanged

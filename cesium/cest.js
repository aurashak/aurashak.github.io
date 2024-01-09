Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer', {
    // imageryProvider: new Cesium.IonImageryProvider({ assetId: 3954 }), // Commented out to use default imagery
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

// Set a standard initial view
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000), // Longitude, Latitude, Height
    orientation: {
        heading: Cesium.Math.toRadians(0.0), // Facing East
        pitch: Cesium.Math.toRadians(-90.0), // Looking down
        roll: 0.0
    }
});

// Slow down the rotation
var spinRate = 0.0003;
viewer.clock.multiplier = 1; // Normal time speed
viewer.scene.preRender.addEventListener(function() {
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
});

var coordsDisplay = document.getElementById('coords');

// Create the handler for mouse movement
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

function showCoordinates(movement) {
    var ray = viewer.camera.getPickRay(movement.endPosition);
    var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (cartesian) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

        coordsDisplay.style.display = 'block';
        coordsDisplay.style.left = (movement.endPosition.x + 10) + 'px'; // Offset a bit for better visibility
        coordsDisplay.style.top = (movement.endPosition.y + 10) + 'px';
        coordsDisplay.textContent = 'Lat: ' + latitudeString + '°, Lon: ' + longitudeString + '°';
    } else {
        coordsDisplay.style.display = 'none';
    }
}

// Add an event listener for mouse movement
handler.setInputAction(showCoordinates, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

// script.js file
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

// Create the viewer with the desired options
var viewer = new Cesium.Viewer('cesiumContainer', {
    // ... other options ...
    skyBox: false,
    skyAtmosphere: false,
    timeline: false,
    homeButton: false,
    navigationHelpButton: false,
    geocoder: true,
    fullscreenButton: false,
    sceneModePicker: true,
    baseLayerPicker: false,
    animation: false,
    vrButton: false,
    infoBox: true
});

// Set the initial view to Afghanistan
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(67.709953, 33.93911, 15000000),
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90), // looking down
        roll: 0.0
    }
});

// Remove the sky atmosphere and sky box
viewer.scene.skyAtmosphere = new Cesium.SkyAtmosphere();
viewer.scene.skyAtmosphere.show = false;

if (viewer.scene.skyBox) {
    viewer.scene.skyBox.destroy();
    viewer.scene.skyBox = undefined;
}

// Explicitly set the background color to white
viewer.scene.backgroundColor = Cesium.Color.WHITE;

// Set the background to white on every post render to ensure it stays white
viewer.scene.postRender.addEventListener(function () {
    viewer.scene.backgroundColor = Cesium.Color.WHITE;
});


// Zoom to an entity with a particular ID
var entityId = 'exampleEntityId'; // Replace with the actual ID of your entity
viewer.zoomTo(viewer.entities.getById(entityId));

// Set up an event handler for when the user clicks on the globe
viewer.screenSpaceEventHandler.setInputAction(function onMouseClick(movement) {
    var pickedObject = viewer.scene.pick(movement.position);
    if (Cesium.defined(pickedObject)) {
        // Perform actions if an object (like an entity) is clicked
        console.log('Clicked an object', pickedObject);
    } else {
        // Perform actions if the globe surface is clicked
        var surfacePosition = viewer.scene.pickPosition(movement.position);
        console.log('Clicked on the globe surface at position', surfacePosition);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);


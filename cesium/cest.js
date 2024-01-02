// script.js file
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';
var viewer = new Cesium.Viewer('cesiumContainer', {
    // Use high-resolution imagery
    imageryProvider: Cesium.createWorldImagery(),
    // Use the Cesium World Terrain
    terrainProvider: Cesium.createWorldTerrain(),
    // Show the Cesium ion logo (there is no direct option to hide it; it can be done via CSS if necessary)
    shouldAnimate: true,
    // Enable lighting based on the sun position
    scene3DOnly: false,
    // Automatically track the entity
    timeline: false,
    // Display the "home" button - set to false to hide
    homeButton: false,
    // Display the navigation help button - set to false to hide
    navigationHelpButton: false,
    // Display the geocoder - set to false to hide
    geocoder: true,
    // Show fullscreen button - set to false to hide
    fullscreenButton: false,
    // Show scene mode picker - set to false to hide
    sceneModePicker: false,
    // Show base layer picker - set to false to hide
    baseLayerPicker: false,
    // Show animation widget - set to false to hide
    animation: false,
    // Show VR button - set to false to hide (if applicable)
    vrButton: false,
    // Show info box - set to false to hide
    infoBox: true
});

// Afghanistan coordinates and view settings
var afghanistanHomeLocation = {
    destination: Cesium.Cartesian3.fromDegrees(67.709953, 33.93911, 20000000),
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90), // looking down
        roll: 0.0
    }
};

// Set the initial view to Afghanistan
viewer.camera.setView(afghanistanHomeLocation);

// Override the default home button behavior to fly to Afghanistan
viewer.homeButton.viewModel.command = function() {
    viewer.camera.flyTo(afghanistanHomeLocation);
};

// Set the skybox to use a single white color
viewer.scene.skyBox.destroy();
viewer.scene.skyBox = undefined;
viewer.scene.backgroundColor = Cesium.Color.WHITE;


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


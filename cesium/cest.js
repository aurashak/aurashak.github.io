// script.js file
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';
var viewer = new Cesium.Viewer('cesiumContainer', {
    // Use high-resolution imagery
    imageryProvider: Cesium.createWorldImagery(),
    // Use the Cesium World Terrain
    terrainProvider: Cesium.createWorldTerrain(),
    // Show the Cesium ion logo
    shouldAnimate: true,
    // Enable lighting based on the sun position
    scene3DOnly: false,
    // Automatically track the entity
    timeline: true,
    // Display the "home" button
    navigationHelpButton: true,
    // Display the geocoder
    geocoder: true,
});

// Set the initial view to Afghanistan
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(67.709953, 33.93911, 30000000), // Longitude and latitude of Afghanistan, with a higher altitude for a wider view
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90), // Pointing downwards
        roll: 0.0
    }
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


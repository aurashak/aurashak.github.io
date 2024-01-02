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


// Load a local GeoJSON file (make sure the file is accessible from your server)
var geoJsonUrl = 'https://aurashak.github.io/geojson/ne_10m_lakes.json';
viewer.dataSources.add(Cesium.GeoJsonDataSource.load(geoJsonUrl, {
    stroke: Cesium.Color.HOTPINK,
    fill: Cesium.Color.PINK.withAlpha(0.5),
    strokeWidth: 3
}));




// Add a handler for mouse move events to display country name and lat/long
var hoverHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

hoverHandler.setInputAction(function (movement) {
    // Get the picked object
    var pickedFeature = viewer.scene.pick(movement.endPosition);
    var countryName = '';
    if (Cesium.defined(pickedFeature) && Cesium.defined(pickedFeature.id)) {
        // For GeoJSON features, the property holding the name might be different
        countryName = pickedFeature.id.properties.name;
    }

    // Get the cartesian position of the mouse pointer on the globe
    var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
    if (cartesian) {
        // Convert cartesian to cartographic coordinates (radians)
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        // Convert radians to degrees and show latitude/longitude
        var latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
        // Display the information, e.g., in a tooltip or HTML element
        // Example: Update an element with ID 'infoBox' with the country name and coordinates
        document.getElementById('infoBox').textContent = `Country: ${countryName}, Lat: ${latitude}, Long: ${longitude}`;
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


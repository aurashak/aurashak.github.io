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
    baseLayerPicker: true,
    animation: false,
    vrButton: false,
    infoBox: true
});

// Select the loading element
var loadingOverlay = document.getElementById('loadingOverlay');

// Add an event listener to hide the loading element when the globe is ready
viewer.scene.globe.tileLoadProgressEvent.addEventListener(function(numberOfPendingTiles) {
    if (numberOfPendingTiles === 0) {
        // When no more tiles are pending, hide the loading element
        loadingOverlay.style.display = 'none';
    }
});

// Initialize the array to store GeoJSON data sources and the satellite imagery layer variable
var geoJsonDataSources = [];
var satelliteImageryLayer;

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


// Function to add a GeoJSON file from a URL and keep track of it
function addGeoJsonDataSource(url, strokeColor, fillColor, strokeWidth) {
    var dataSourcePromise = Cesium.GeoJsonDataSource.load(url, {
        stroke: strokeColor,
        fill: fillColor,
        strokeWidth: strokeWidth
    });
    dataSourcePromise.then(function(dataSource) {
        viewer.dataSources.add(dataSource);
        geoJsonDataSources.push(dataSource);
    });
    return dataSourcePromise;
}


// Load a GeoJSON file from a URL




// Add a handler for mouse move events to display feature name and lat/long
var hoverHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

hoverHandler.setInputAction(function (movement) {
    var infoBoxText = ''; // This will hold the names of the features (country, lake, or river)
    var pickedObjects = viewer.scene.drillPick(movement.endPosition);
    
    // Store unique names to avoid duplicates if entities overlap
    var uniqueNames = new Set();

    // Iterate over all picked objects to get names of the features
    for (var i = 0; i < pickedObjects.length; i++) {
        var entity = pickedObjects[i].id;
        if (Cesium.defined(entity) && entity.properties && entity.properties.name) {
            uniqueNames.add(entity.properties.name.getValue());
        }
    }

    // Join all unique feature names
    if (uniqueNames.size > 0) {
        infoBoxText = Array.from(uniqueNames).join(', ');
    }

    // Update the info box with the feature names and coordinates
    if (infoBoxText !== '') {
        // Get the cartesian position of the mouse pointer on the globe
        var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
        if (cartesian) {
            // Convert cartesian to cartographic coordinates (radians)
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            // Convert radians to degrees and show latitude/longitude
            var latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
            infoBoxText += ` | Lat: ${latitude}, Long: ${longitude}`;
        }
    } else {
        infoBoxText = 'World';
    }
    
    // Display the information
    document.getElementById('infoBox').textContent = infoBoxText;

}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


// Function to toggle the visibility of the satellite imagery layer
function toggleSatelliteImagery() {
    if (viewer.imageryLayers.length > 0) {
        var satelliteLayer = viewer.imageryLayers.get(0); // Get the first imagery layer
        satelliteLayer.show = !satelliteLayer.show; // Toggle the visibility
    }
}

// Get the button and add click event listener
var toggleButton = document.getElementById('toggleSatelliteImagery');
toggleButton.addEventListener('click', toggleSatelliteImagery);



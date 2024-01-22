
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

// Create a function to add a grid to the scene
function createGrid() {
    var gridSpacing = 0.1; // Adjust the spacing between grid lines
    var gridColor = Cesium.Color.WHITE;

    for (var lon = -180; lon < 180; lon += gridSpacing) {
        var positions = [];
        for (var lat = -90; lat <= 90; lat++) {
            positions.push(Cesium.Cartesian3.fromDegrees(lon, lat));
        }

        viewer.entities.add({
            polyline: {
                positions: positions,
                width: 1,
                material: gridColor,
            },
        });
    }

    for (var lat = -90; lat < 90; lat += gridSpacing) {
        var positions = [];
        for (var lon = -180; lon <= 180; lon++) {
            positions.push(Cesium.Cartesian3.fromDegrees(lon, lat));
        }

        viewer.entities.add({
            polyline: {
                positions: positions,
                width: 1,
                material: gridColor,
            },
        });
    }
}

createGrid(); // Call the function to create the grid

viewer.scene.backgroundColor = Cesium.Color.BLUE.withAlpha(0.01); // A very low alpha value

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
    }
});


viewer.camera.percentageChanged = 0.01; // Adjust this threshold as needed


// Function to rotate the globe slowly
function rotateGlobe() {
    if (isRotating) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
    }
}

// Slow down the rotation
var spinRate = 0.001; // Increase the spin rate for a faster rotation
var isRotating = true; // To keep track of the rotation state

function toggleRotation() {
    isRotating = !isRotating;
    if (isRotating) {
        rotateGlobe();
    }
}


// Inside your code, add the following line at the end to continuously rotate the globe
setInterval(rotateGlobe, 10); // Adjust the interval as needed for the desired rotation speed



// Add an event listener to toggle rotation when clicking on the canvas
handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function() {
    toggleRotation();
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Define variables to keep track of layer visibility
var osmLayerVisible = true; // OpenStreetMap
var sentinelLayerVisible = true; // Sentinel-2



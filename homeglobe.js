
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';


// Show the loading spinner
var loadingSpinner = document.getElementById('loadingSpinner');
loadingSpinner.style.display = 'block';

// Initialize the Cesium viewer
var viewer = new Cesium.Viewer('cesiumContainer1', {
    // ... your viewer configuration ...
});

// Hide the loading spinner when the globe is ready
viewer.scene.globe.readyPromise.then(function() {
    loadingSpinner.style.display = 'none';
});


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



viewer.scene.backgroundColor = Cesium.Color.WHITE.withAlpha(0.01); // A very low alpha value

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



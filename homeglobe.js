Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer1', {
    baseLayerPicker: false,
    geocoder: true,
    homeButton: false,
    infoBox: true,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false,
    skyBox: false, // Disable the skybox
    skyAtmosphere: false, // Disable the sky atmosphere
    backgroundColor: Cesium.Color.WHITE // Set the background color to white
});

// Later in your code, you can change the background color to white again
viewer.scene.backgroundColor = Cesium.Color.WHITE;

// Flag to track the current imagery layer
var isSentinel2Visible = true;

// Get the layer slider element and its value display element
var layerSlider = document.getElementById("layerSlider");
var layerValueDisplay = document.getElementById("layerValue");

// Update the value display when the layer slider value changes
layerSlider.addEventListener("input", function () {
    if (layerSlider.value === "0") {
        layerValueDisplay.textContent = "OpenStreetMap";
    } else {
        layerValueDisplay.textContent = "Sentinel-2";
    }

    // Call the function to toggle layers based on the slider value
    toggleImageryLayer(parseInt(layerSlider.value));
});

// Modify the existing toggleImageryLayer function to accept a parameter for layer selection
function toggleImageryLayer(layer) {
    if (layer === 0) {
        // Remove Sentinel-2 layer and add OpenStreetMap layer
        viewer.imageryLayers.remove(sentinel2Layer);
        viewer.imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
        }));
    } else {
        // Remove OpenStreetMap layer and add Sentinel-2 layer
        viewer.imageryLayers.remove(viewer.imageryLayers.get(1)); // Assuming OpenStreetMap is the second layer added
        viewer.imageryLayers.addImageryProvider(
            new Cesium.IonImageryProvider({ assetId: 3954 })
        );
    }
}


// Set the initial rotation rate
var spinRate = 0.0003;

// Flag to track rotation state
var isRotating = true;

// Function to start or stop the rotation on mouse click
function toggleRotation() {
    isRotating = !isRotating;
}

// Create a click event handler to toggle rotation on mouse click
var clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
clickHandler.setInputAction(toggleRotation, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Function to update the globe rotation
function updateRotation() {
    if (isRotating) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
    }
}

// Add a render loop to continuously update the rotation
viewer.scene.postRender.addEventListener(updateRotation);


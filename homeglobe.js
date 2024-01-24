// The viewModel tracks the state of our mini application.
const viewModel = {
    brightness: 0,
    contrast: 0,
    hue: 0,
    saturation: 0,
    gamma: 0,
};
// Convert the viewModel members into knockout observables.
Cesium.knockout.track(viewModel);

// Bind the viewModel to the DOM elements of the UI that call for it.
const toolbar = document.getElementById("toolbar");
Cesium.knockout.applyBindings(viewModel, toolbar);

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

// Function to toggle between Sentinel-2 and OpenStreetMap layers
function toggleImageryLayer() {
    if (isSentinel2Visible) {
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

    // Toggle the flag
    isSentinel2Visible = !isSentinel2Visible;
}

// Get the slider element and its value display element
var slider = document.getElementById("mySlider");
var sliderValueDisplay = document.getElementById("sliderValue");

// Update the value display when the slider value changes
slider.addEventListener("input", function () {
    sliderValueDisplay.textContent = slider.value;
});

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

// The following code is added for image adjustment

const imageryLayers = viewer.imageryLayers;

// Make the active imagery layer a subscriber of the viewModel.
function subscribeLayerParameter(name) {
    Cesium.knockout
        .getObservable(viewModel, name)
        .subscribe(function (newValue) {
            if (imageryLayers.length > 0) {
                const layer = imageryLayers.get(0);
                layer[name] = newValue;
            }
        });
}

subscribeLayerParameter("brightness");
subscribeLayerParameter("contrast");
subscribeLayerParameter("hue");
subscribeLayerParameter("saturation");
subscribeLayerParameter("gamma");

imageryLayers.get(0).saturation = 3.0;

// Make the viewModel react to base layer changes.
function updateViewModel() {
    if (imageryLayers.length > 0) {
        const layer = imageryLayers.get(0);
        viewModel.brightness = layer.brightness;
        viewModel.contrast = layer.contrast;
        viewModel.hue = layer.hue;
        viewModel.saturation = layer.saturation;
        viewModel.gamma = layer.gamma;
    }
}

imageryLayers.layerAdded.addEventListener(updateViewModel);
imageryLayers.layerRemoved.addEventListener(updateViewModel);
imageryLayers.layerMoved.addEventListener(updateViewModel);
updateViewModel();

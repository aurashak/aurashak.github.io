
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
    fullscreenButton: false,
    animation: false
});

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
    }
});

viewer.camera.percentageChanged = 0.01;

var spinRate = 0.0003;
var isRotating = true;

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

var sentinelLayerVisible = true; // Sentinel-2

// Function to create a toggle switch for the "Grid" layer
function createGridToggleSwitch() {
  const gridToggleSwitch = document.createElement("label");
  gridToggleSwitch.classList.add("toggle-switch");

  const gridToggleInput = document.createElement("input");
  gridToggleInput.type = "checkbox";
  gridToggleInput.checked = true; // Set the initial state to "on"
  gridToggleInput.addEventListener("change", () => {
    // Toggle the visibility of the grid layer based on the checkbox state
    if (gridLayer) {
      gridLayer.show = gridToggleInput.checked;
    }
  });

  const gridToggleSlider = document.createElement("span");
  gridToggleSlider.classList.add("toggle-slider");

  gridToggleSwitch.appendChild(gridToggleInput);
  gridToggleSwitch.appendChild(gridToggleSlider);

  const gridToggleLabel = document.createElement("span");
  gridToggleLabel.textContent = "Grid";
  gridToggleSwitch.appendChild(gridToggleLabel);

  // Append the toggle switch to the "toolbar" div
  const toolbar = document.getElementById("toolbar");
  toolbar.appendChild(gridToggleSwitch);
}

// Function to setup the layers
function setupLayers() {
  const imageryLayers = viewer.imageryLayers;

  // Assuming you have these layers defined elsewhere
  // ...

  // Extract the "Grid" and "OpenStreetMaps" layers (make sure "imageryLayers" is defined)
  gridLayer = imageryLayers.getByName("Grid");
  openStreetMapsLayer = imageryLayers.getByName("OpenStreetMaps");

  // Create the toggle switch for the "Grid" layer
  createGridToggleSwitch();
}

setupLayers();
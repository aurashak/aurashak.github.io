var viewer = new Cesium.Viewer('mtsmap', {
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: true,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    animation: false,
    timeline: false,
    scene3DOnly: true,
    sceneMode: Cesium.SceneMode.SCENE3D,
    screenSpaceCameraController: {
        minimumZoomDistance: 200.0, // Set minimum zoom distance (in meters)
        maximumZoomDistance: 1000.0 // Set maximum zoom distance (in meters)
    }
});

var osm3D = viewer.scene.primitives.add(Cesium.createOsmBuildings());

// Function to toggle satellite layer
function toggleSatellite() {
    var checkbox = document.getElementById('toggleSatellite');
    if (checkbox.checked) {
        viewer.imageryLayers.addImageryProvider(Cesium.createWorldImagery());
    } else {
        viewer.imageryLayers.remove(viewer.imageryLayers.get(1)); // Assumes satellite layer is at index 1
    }
}

// Attach event listener to the checkbox
document.getElementById('toggleSatellite').addEventListener('change', toggleSatellite);

// Set the camera to focus slightly further west, facing east, and at a closer zoom
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0015, 40.8167, 500.0), // Closer zoom (lower altitude)
    orientation: {
        heading: Cesium.Math.toRadians(90),  // Rotate to face east
        pitch: Cesium.Math.toRadians(-25),   // Lower the pitch angle
        roll: Cesium.Math.toRadians(0)
    }
});
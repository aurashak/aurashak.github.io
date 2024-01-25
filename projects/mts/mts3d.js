Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjljMGQ4MS0zNzJkLTQxMjItODk1OC03ZDkwM2VkYzYwMDUiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDYxNTcwNDJ9.9AcXXdl9PUpvx5y-XBR81kIHSjjfRbY6wDM-JPVPCZo';

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
    backgroundColor: Cesium.Color.WHITE, 

    screenSpaceCameraController: {
        minimumZoomDistance: 200.0, // Set minimum zoom distance (in meters)
        maximumZoomDistance: 1000.0 // Set maximum zoom distance (in meters)
    }
});

       



// Add Photorealistic 3D Tiles
try {
    async function loadPhotorealistic3DTiles() {
        const tileset = await Cesium.createGooglePhotorealistic3DTileset();
        viewer.scene.primitives.add(tileset);

        // Point the camera at the Googleplex
        viewer.scene.camera.setView({
            destination: new Cesium.Cartesian3(
                -2693797.551060477,
                -4297135.517094725,
                3854700.7470414364
            ),
            orientation: new Cesium.HeadingPitchRoll(
                4.6550106925119925,
                -0.2863894863138836,
                1.3561760425773173e-7
            ),
        });
    }

    loadPhotorealistic3DTiles();
} catch (error) {
    console.log(`Error loading Photorealistic 3D Tiles tileset: ${error}`);
}




var osm3D = viewer.scene.primitives.add(Cesium.createOsmBuildings());

// Function to toggle OSM layer
function toggleOSMLayer() {
    var checkbox = document.getElementById('toggleOSM');
    if (checkbox.checked) {
        viewer.imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
        }));
    } else {
        viewer.imageryLayers.remove(viewer.imageryLayers.get(1)); // Assumes OSM layer is at index 1
    }
}


// Attach event listener to the checkbox
document.getElementById('toggleOSM').addEventListener('change', toggleOSMLayer);

// Set the camera to focus slightly further west, facing east, and at a closer zoom
viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(40.82280149407267, -73.96356589415986, 300.0),
    orientation: {
        heading: Cesium.Math.toRadians(90),
        pitch: Cesium.Math.toRadians(-25),
        roll: Cesium.Math.toRadians(0)
    }
});

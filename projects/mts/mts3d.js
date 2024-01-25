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
    sceneMode: Cesium.SceneMode.SCENE3D
});

var osm3D = viewer.scene.primitives.add(Cesium.createOsmBuildings());

var defaultImageryProvider = viewer.imageryLayers.get(0).imageryProvider
var satelliteLayer = Cesium.createWorldImagery();

// Set the camera to focus slightly further west and facing east
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0015, 40.8167, 1500.0), 
    orientation: {
        heading: Cesium.Math.toRadians(90),  
        pitch: Cesium.Math.toRadians(-65),   
        roll: Cesium.Math.toRadians(0)
    }
});

// Function to toggle satellite layer
function toggleSatellite() {
    var checkbox = document.getElementById('toggleSatellite');
    if (checkbox.checked) {
        viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }));
    } else {
        viewer.imageryLayers.remove(viewer.imageryLayers.get(1)); // Assumes satellite layer is at index 1
    }
}

// Attach event listener to the checkbox
document.getElementById('toggleSatellite').addEventListener('change', toggleSatellite);

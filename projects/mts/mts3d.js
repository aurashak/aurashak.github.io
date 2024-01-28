Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjljMGQ4MS0zNzJkLTQxMjItODk1OC03ZDkwM2VkYzYwMDUiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDYxNTcwNDJ9.9AcXXdl9PUpvx5y-XBR81kIHSjjfRbY6wDM-JPVPCZo';

var viewer = new Cesium.Viewer('mtsmap', {
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: true,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false,
    skyBox: false,
    skyAtmosphere: false,
    scene3DOnly: false,
    sceneMode: Cesium.SceneMode.SCENE3D,
});

// Set the center point
var centerLongitude = -73.97421308903137;
var centerLatitude = 40.820382982431454;

// Define the radius (in meters) for the half-mile radius
var radius = 1804.672; 

// Calculate bounding box coordinates based on the radius
var degreesPerMeter = 1.0 / (Math.PI / 180.0 * 6378137.0);
var westLongitude = centerLongitude - (radius * degreesPerMeter);
var eastLongitude = centerLongitude + (radius * degreesPerMeter);
var southLatitude = centerLatitude - (radius * degreesPerMeter);
var northLatitude = centerLatitude + (radius * degreesPerMeter);

// Set the camera to focus on the specified bounding box
viewer.scene.camera.setView({
    destination: Cesium.Rectangle.fromDegrees(westLongitude, southLatitude, eastLongitude, northLatitude),
    orientation: {
        heading: Cesium.Math.toRadians(90),
        pitch: Cesium.Math.toRadians(-25),
        roll: Cesium.Math.toRadians(0),
    },
});

// Set minimum and maximum zoom distances
viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200.0;
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1000.0;

// Add OSM buildings
var osm3D = viewer.scene.primitives.add(Cesium.createOsmBuildings());

// Restrict panning to a half-mile area around the center
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (movement) {
    var pickedLocation = viewer.scene.pickPosition(movement.endPosition);
    if (pickedLocation) {
        var cartographic = Cesium.Cartographic.fromCartesian(pickedLocation);
        if (
            cartographic.longitude < westLongitude ||
            cartographic.longitude > eastLongitude ||
            cartographic.latitude < southLatitude ||
            cartographic.latitude > northLatitude
        ) {
            // Reset the camera to stay within the desired bounds
            viewer.scene.camera.flyTo({
                destination: Cesium.Rectangle.fromDegrees(westLongitude, southLatitude, eastLongitude, northLatitude),
                orientation: {
                    heading: Cesium.Math.toRadians(90),
                    pitch: Cesium.Math.toRadians(-25),
                    roll: Cesium.Math.toRadians(0),
                },
                duration: 0.5,
            });
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

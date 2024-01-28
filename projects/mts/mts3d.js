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
var radius = 804.672; // Approximately 0.5 miles in meters

// Calculate bounding box coordinates based on the radius
var westLongitude = centerLongitude - Cesium.Math.toDegrees(radius / Cesium.EarthConstants.RADIUS);
var eastLongitude = centerLongitude + Cesium.Math.toDegrees(radius / Cesium.EarthConstants.RADIUS);
var southLatitude = centerLatitude - Cesium.Math.toDegrees(radius / Cesium.EarthConstants.RADIUS);
var northLatitude = centerLatitude + Cesium.Math.toDegrees(radius / Cesium.EarthConstants.RADIUS);

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

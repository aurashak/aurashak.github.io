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


var osm3D = viewer.scene.primitives.add(Cesium.createOsmBuildings());

// Set the camera to focus slightly further west, facing east, and at a closer zoom
viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-73.97421308903137, 40.820382982431454, 500.0),
    orientation: {
        heading: Cesium.Math.toRadians(90),
        pitch: Cesium.Math.toRadians(-25),
        roll: Cesium.Math.toRadians(0),
    },
});

// Set minimum and maximum zoom distances
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1400.0;
viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200.0;

// Define bounds around the viewing area
var westLongitude = -74.0015;
var eastLongitude = -73.9465;
var southLatitude = 40.8090;
var northLatitude = 40.8330;

// Calculate the center point
var centerLongitude = (westLongitude + eastLongitude) / 2;
var centerLatitude = (southLatitude + northLatitude) / 2;

var centerPoint = Cesium.Cartesian3.fromDegrees(centerLongitude, centerLatitude);

// Restrict camera to stay within the defined bounds
viewer.scene.screenSpaceCameraController.minimumZoomDistance = Cesium.Cartesian3.distance(
    centerPoint,
    Cesium.Cartesian3.fromDegrees(westLongitude, southLatitude)
);
viewer.scene.screenSpaceCameraController.maximumZoomDistance = Cesium.Cartesian3.distance(
    centerPoint,
    Cesium.Cartesian3.fromDegrees(eastLongitude, northLatitude)
);

// Set the camera to focus on the center point
viewer.scene.camera.setView({
    destination: centerPoint,
    orientation: {
        heading: Cesium.Math.toRadians(90),
        pitch: Cesium.Math.toRadians(-25),
        roll: Cesium.Math.toRadians(0),
    },
});

// Create a GeoJSON data source
var geoJsonDataSource = new Cesium.GeoJsonDataSource();

// Load the GeoJSON file
Cesium.GeoJsonDataSource.load('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson')
    .then(function(dataSource) {
        // Add the GeoJSON data source to the viewer
        viewer.dataSources.add(dataSource);

        // Get the entities from the data source
        var entities = dataSource.entities.values;

        // Customize the appearance of each entity (line)
        entities.forEach(function(entity) {
            entity.polyline.material = Cesium.Color.PURPLE;
            entity.polyline.width = 5.0; // Set your desired line width here
        });
    })
    .otherwise(function(error) {
        // Handle the error loading GeoJSON
        console.error(error);
    });

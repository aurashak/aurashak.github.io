Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjljMGQ4MS0zNzJkLTQxMjItODk1OC03ZDkwM2VkYzYwMDUiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDYxNTcwNDJ9.9AcXXdl9PUpvx5y-XBR81kIHSjjfRbY6wDM-JPVPCZo';

var viewer = new Cesium.Viewer('mtsmap', {
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    animation: false,
    timeline: false,
    scene3DOnly: false,
    sceneMode: Cesium.SceneMode.SCENE3D,
    backgroundColor: Cesium.Color.WHITE,
});

// Set up bounds for camera movement
var westBound = Cesium.Math.toRadians(-74.0015);
var eastBound = Cesium.Math.toRadians(-73.9465);
var southBound = Cesium.Math.toRadians(40.8090);
var northBound = Cesium.Math.toRadians(40.8330);

// Set minimum and maximum zoom distances
viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200.0;
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1000.0;

// Set the panning limits
viewer.scene.screenSpaceCameraController.maximumTranslate = 5000.0;

// Create a ScreenSpaceEventHandler to handle camera movement
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

// Listen for left mouse down event
handler.setInputAction(function (movement) {
    handler.lastMousePosition = movement.startPosition ? movement.startPosition.clone() : undefined;
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

// Listen for mouse move event
handler.setInputAction(function (movement) {
    if (handler.lastMousePosition) {
        var offsetX = movement.endPosition.x - handler.lastMousePosition.x;
        var offsetY = movement.endPosition.y - handler.lastMousePosition.y;

        // Convert the pixel offset to degrees
        var camera = viewer.scene.camera;
        var ellipsoid = viewer.scene.globe.ellipsoid;

        var moveAmount = camera.pickEllipsoid(movement.startPosition, ellipsoid);
        if (moveAmount) {
            moveAmount = ellipsoid.cartesianToCartographic(moveAmount);
            moveAmount = Cesium.Cartesian3.fromDegrees(
                Cesium.Math.toDegrees(moveAmount.longitude) + Cesium.Math.toDegrees(offsetX),
                Cesium.Math.toDegrees(moveAmount.latitude) + Cesium.Math.toDegrees(offsetY),
                0.0
            );

            // Check if the new position is within bounds
            if (
                moveAmount.longitude > westBound &&
                moveAmount.longitude < eastBound &&
                moveAmount.latitude > southBound &&
                moveAmount.latitude < northBound
            ) {
                camera.position = moveAmount;
                camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
            }
        }

        handler.lastMousePosition = movement.endPosition.clone();
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

// Listen for left mouse up event
handler.setInputAction(function () {
    handler.lastMousePosition = undefined;
}, Cesium.ScreenSpaceEventType.LEFT_UP);

// Add GeoJSON source for wastewater treatment
var wastewaterTreatmentSource = new Cesium.GeoJsonDataSource('wastewatertreatment-source', {
    sourceUri: 'https://aurashak.github.io/geojson/nyc/wastewatertreatment.geojson',
});

// Add GeoJSON layer for brown circle markers for wastewater treatment
var wastewaterTreatmentLayer = viewer.dataSources.add(wastewaterTreatmentSource).then(function (dataSource) {
    return viewer.entities.add({
        name: 'Wastewater Treatment',
        show: false, // Initially set to false
        parent: dataSource.entities,
        point: {
            pixelSize: 15,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
        },
    });
});

// Repeat the above steps for other GeoJSON sources and layers

// ...

// Add GeoJSON source for 100-year floodplain
var floodplainSource = new Cesium.GeoJsonDataSource('100yearfloodplain-source', {
    sourceUri: 'https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson',
});

// Add GeoJSON layer for the polygon for 100-year floodplain
var floodplainLayer = viewer.dataSources.add(floodplainSource).then(function (dataSource) {
    return viewer.entities.add({
        name: '100-year Floodplain',
        show: false, // Initially set to false
        parent: dataSource.entities,
        polygon: {
            hierarchy: dataSource.entities.values[0].polygon.hierarchy,
            material: Cesium.Color.fromCssColorString('rgba(0, 0, 255, 0.5)'),
        },
    });
});

// You can use the wastewaterTreatmentLayer and floodplainLayer variables to toggle the visibility of these layers when needed.

// Later in your code, you can change the background color to white again
viewer.scene.backgroundColor = Cesium.Color.WHITE;

var osm3D = viewer.scene.primitives.add(Cesium.createOsmBuildings());

// Function to toggle satellite layer
function toggleSatellite() {
    var checkbox = document.getElementById('toggleSatellite');

    // Remove existing satellite layer
    viewer.imageryLayers.removeIf(function (layer) {
        return layer.imageryProvider === Cesium.createWorldImagery();
    });

    // Add or remove satellite layer based on checkbox state
    if (checkbox.checked) {
        viewer.imageryLayers.addImageryProvider(Cesium.createWorldImagery());
    }
}

// Attach event listener to the checkbox
document.getElementById('toggleSatellite').addEventListener('change', toggleSatellite);

// Set the camera to focus slightly further west, facing east, and at a closer zoom
viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-73.97421308903137, 40.820382982431454, 500.0), // Adjusted coordinates and altitude
    orientation: {
        heading: Cesium.Math.toRadians(90), // Rotate to face east
        pitch: Cesium.Math.toRadians(-25), // Lower the pitch angle
        roll: Cesium.Math.toRadians(0),
    },
});

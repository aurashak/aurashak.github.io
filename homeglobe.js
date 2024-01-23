
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
    animation: false,
    skyBox: false, // Disable the skybox
    skyAtmosphere: false, // Disable the sky atmosphere
    backgroundColor: Cesium.Color.WHITE // Set the background color to white
});




// Later in your code, you can change the background color to white again
viewer.scene.backgroundColor = Cesium.Color.WHITE;


// Load the Sentinel-2 imagery layer
var sentinel2Layer = viewer.imageryLayers.addImageryProvider(
    new Cesium.IonImageryProvider({ assetId: 3954 }) // Asset ID for Sentinel-2 imagery
);





// Load the GeoJSON file
var geoJsonUrl = 'https://aurashak.github.io/geojson/aboutaurash.geojson';
var dataSourcePromise = Cesium.CzmlDataSource.load(geoJsonUrl);

dataSourcePromise.then(function (dataSource) {
    // Add the GeoJSON data to the viewer
    viewer.dataSources.add(dataSource);

    // Get the entities from the data source
    var entities = dataSource.entities.values;

    // Define a pink circle marker style
    var pinkCircleStyle = new Cesium.IconStyle({
        url: 'path/to/pink-circle-marker.png', // Replace with the path to your pink circle marker image
        color: Cesium.Color.PINK, // Set the marker color to pink
        scale: 0.5 // Adjust the marker size as needed
        height: 50000 // Set the height value (in meters) to position the markers above the satellite imagery
    });

    // Loop through the entities and apply the style
    entities.forEach(function (entity) {
        entity.billboard = pinkCircleStyle;
    });
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


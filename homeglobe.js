
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

// Function to add the GeoJSON layer to the globe
function addGeoJsonLayer() {
    var dataSourcePromise = Cesium.GeoJsonDataSource.load('https://aurashak.github.io/geojson/world/cities.geojson');
    dataSourcePromise.then(function(dataSource) {
        viewer.dataSources.add(dataSource);

        // Adjust the appearance and style of the GeoJSON entities
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            entity.point = new Cesium.PointGraphics({
                pixelSize: 10,
                color: Cesium.Color.RED
            });

        }

           // Function to create a blip at a random city
           function createRandomBlip() {
            var randomIndex = Math.floor(Math.random() * entities.length);
            var randomCity = entities[randomIndex];
            
            // Create a temporary blip entity
            var blip = viewer.entities.add({
                position: randomCity.position.clone(),
                point: {
                    pixelSize: 20,
                    color: Cesium.Color.BLUE
                }
            });

            // Remove the blip entity after a random interval between 1-10 seconds
            var randomInterval = Math.random() * 9000 + 1000; // Random interval between 1-10 seconds
            setTimeout(function() {
                viewer.entities.remove(blip);
            }, randomInterval);
        }

        // Create blips at random intervals
        setInterval(createRandomBlip, 10000); // Create a blip every 10 seconds
    }).otherwise(function(error) {
        console.error(error);
    });
}


// Call the function to add the GeoJSON layer
addGeoJsonLayer();
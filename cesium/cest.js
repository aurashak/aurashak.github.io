Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer', {
    // imageryProvider: new Cesium.IonImageryProvider({ assetId: 3954 }), // Commented out to use default imagery
    baseLayerPicker: false,
    geocoder: true,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false
});

// Define handler in the global scope
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);


// Set a standard initial view
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000), // Longitude, Latitude, Height
    orientation: {
        heading: Cesium.Math.toRadians(0.0), // Facing East
        pitch: Cesium.Math.toRadians(-90.0), // Looking down
        roll: 0.0
    }
});

// Slow down the rotation
var spinRate = 0.0003;
var isRotating = true; // To keep track of the rotation state
var rotateGlobeFunction = function() {
    if (isRotating) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
    }
};

// Add the preRender event listener to start rotating the globe
viewer.scene.preRender.addEventListener(rotateGlobeFunction);

// Function to stop the globe rotation
function stopRotation() {
    isRotating = false; // Set the flag to false to stop the rotation
}

// Add the left click event handler to stop rotation
handler.setInputAction(stopRotation, Cesium.ScreenSpaceEventType.LEFT_DOWN);

var coordsBox = document.getElementById('coordsBox');
coordsBox.style.display = 'block';
coordsBox.textContent = 'Map data: Lat: -, Lon: -'; // Default text

function showCoordinates(movement) {
    var ray = viewer.camera.getPickRay(movement.endPosition);
    var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    var entity = viewer.scene.pick(movement.endPosition);

    if (cartesian) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
        
        var hoverText = 'Map data: Lat: ' + latitudeString + '°, Lon: ' + longitudeString + '°';

        // Check if an entity was picked
        if (Cesium.defined(entity) && entity.id && entity.id.properties) {
            var nameProperty = entity.id.properties.name;
            if (Cesium.defined(nameProperty)) {
                hoverText += '<br>' + 'Name: ' + nameProperty.getValue();
            }
        }

        // Update text content
        coordsBox.innerHTML = hoverText;
        coordsBox.style.display = 'block';
    } else {
        coordsBox.style.display = 'none';
    }
}

handler.setInputAction(showCoordinates, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


// Additionally, you may want to set up an event listener for when the mouse leaves the globe
// to set the coordsBox to the default text
viewer.scene.canvas.addEventListener('mouseleave', function() {
    coordsBox.innerHTML = defaultText;
    coordsBox.style.display = 'block';
});

var oceansGeojsonUrl = 'https://aurashak.github.io/geojson/oceans.geojson'; // URL to the oceans GeoJSON

Cesium.GeoJsonDataSource.load(oceansGeojsonUrl).then(function(dataSource) {
    // Apply any desired styling to the data source here
    // For example, setting the fill color for polygons representing oceans
    dataSource.entities.values.forEach(function(entity) {
        if (entity.polygon) {
            entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.5); // Semi-transparent blue
            entity.polygon.outline = false; // Disable the outline for polygons
        }
    });

    viewer.dataSources.add(dataSource);
}).otherwise(function(error){
    // Handle any errors that might occur during loading of the GeoJSON
    console.error(error);
});


var countriesGeojsonUrl = 'https://aurashak.github.io/geojson/europe.json'; // URL to the countries GeoJSON

Cesium.GeoJsonDataSource.load(countriesGeojsonUrl).then(function(dataSource) {
    // Apply styling to the data source here
    dataSource.entities.values.forEach(function(entity) {
        if (entity.polygon) {
            // Set polygon material to black and make it opaque
            entity.polygon.material = Cesium.Color.BLACK.withAlpha(1.0);
            // Enable the outline for polygons and set it to white
            entity.polygon.outline = true;
            entity.polygon.outlineColor = Cesium.Color.WHITE;
        }
    });

    viewer.dataSources.add(dataSource);
}).otherwise(function(error){
    // Handle any errors that might occur during loading of the GeoJSON
    console.error(error);
});




var geojsonUrl = 'https://aurashak.github.io/geojson/projectmarkers.geojson'; // Define the URL

Cesium.GeoJsonDataSource.load(geojsonUrl).then(function(dataSource) {
    viewer.dataSources.add(dataSource);

    var entities = dataSource.entities.values;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];

        // Remove the billboard property to get rid of the pin icon
        entity.billboard = undefined;

        // Check if the entity has properties and a marker-color
        if (entity.properties && entity.properties['marker-color']) {
            var color = Cesium.Color.fromCssColorString(entity.properties['marker-color'].getValue());

            // Customize the point appearance with the marker-color from the GeoJSON properties
            entity.point = new Cesium.PointGraphics({
                pixelSize: 10,
                color: color, // Use the color from the GeoJSON properties
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 0
            });
        }

        // Disable the pop-up infobox for each point
        entity.description = undefined;
    }
});


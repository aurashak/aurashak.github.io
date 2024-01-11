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

var imageryLayers = viewer.imageryLayers;
var baseLayer = imageryLayers.get(0); // Assuming the base layer is the first one
baseLayer.brightness = 1.2; // Adjust the brightness, default is 1.0
baseLayer.contrast = 1.2; // Adjust the contrast, default is 1.0

var currentTime = Cesium.JulianDate.now();
viewer.clock.currentTime = Cesium.JulianDate.addHours(currentTime, 10, new Cesium.JulianDate()); // Move 6 hours forward


// Load and style the project markers with halos
Cesium.GeoJsonDataSource.load('https://aurashak.github.io/geojson/projectmarkers.geojson').then(function(dataSource) {
    viewer.dataSources.add(dataSource);

    dataSource.entities.values.forEach(function(entity) {
        // Set the billboard property to undefined
        entity.billboard = undefined;

        // Check if the entity has a marker-color property
        if (entity.properties && entity.properties['marker-color']) {
            var color = Cesium.Color.fromCssColorString(entity.properties['marker-color'].getValue());

            // Set the point to be transparent
            entity.point = new Cesium.PointGraphics({
                pixelSize: 0, // Hide the default point
                color: Cesium.Color.TRANSPARENT
            });

            // Create the halo effect using EllipseGraphics
            entity.ellipse = new Cesium.EllipseGraphics({
                semiMinorAxis: 5000, // Initial size, will be updated based on zoom
                semiMajorAxis: 5000, // Initial size, will be updated based on zoom
                height: 10, // Height above the surface
                material: color.withAlpha(0.5), // Set transparency for the halo
                outline: true,
                outlineColor: color,
                outlineWidth: 30,
                fill: false
            });
        }
    });

    // Update halos based on camera height
    viewer.camera.changed.addEventListener(function() {
        var cameraHeight = viewer.camera.positionCartographic.height;
        dataSource.entities.values.forEach(function(entity) {
            if (entity.ellipse) {
                var baseSize = 5000; // Base size of the halo
                var sizeFactor = cameraHeight / 1000000;
                var newSize = Math.max(baseSize, baseSize * Math.max(sizeFactor, 0.1)); // Prevent size from going below a minimum

                entity.ellipse.semiMinorAxis = newSize;
                entity.ellipse.semiMajorAxis = newSize;
            }
        });
    });
}).otherwise(function(error) {
    console.error('Error loading GeoJSON data:', error);
});



// Set the initial view
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
    }
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

// At the top of your script, define the default text
var defaultText = 'Latitude: Longitude: <br>Place: ';

var coordsBox = document.getElementById('coordsBox');
coordsBox.style.display = 'block';
coordsBox.innerHTML = defaultText;  // Set the default text as innerHTML instead of textContent


function showCoordinates(movement) {
    var ray = viewer.camera.getPickRay(movement.endPosition);
    var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    var entity = viewer.scene.pick(movement.endPosition);

    if (cartesian) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
        
        var hoverText = 'Latitude: ' + latitudeString + '°, Longitude: ' + longitudeString + '°';

        // Check if an entity was picked
        if (Cesium.defined(entity) && entity.id && entity.id.properties) {
            var nameProperty = entity.id.properties.name;
            if (Cesium.defined(nameProperty)) {
                hoverText += '<br>' + 'Place: ' + nameProperty.getValue();
            }
        }

        // Update text content
        coordsBox.innerHTML = hoverText;
        coordsBox.style.display = 'block';
    }
}

handler.setInputAction(showCoordinates, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


// Additionally, you may want to set up an event listener for when the mouse leaves the globe
// to set the coordsBox to the default text
viewer.scene.canvas.addEventListener('mouseleave', function() {
    coordsBox.innerHTML = defaultText;
    coordsBox.style.display = 'block';
});




// Define heights for different layer types
var continentHeight = 500; // Adjust as needed
var lakeRiverHeight = 600; // Adjust as needed
var oceanHeight = 500; // Oceans typically don't need extrusion

// Function to load and style a GeoJSON layer with extrusion
function loadAndStyleGeoJson(url, color, outlineColor, height, isRiverLayer = false) {
    return Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
        dataSource.entities.values.forEach(function(entity) {
            if (entity.polygon) {
                // Styling for polygon features (Continents and Lakes)
                entity.polygon.material = color;
                entity.polygon.outline = true;
                entity.polygon.outlineColor = outlineColor;
                entity.polygon.extrudedHeight = height;
            }
            if (isRiverLayer && entity.polyline) {
                // Styling for polyline features (Rivers)
                entity.polyline.material = color;
                entity.polyline.width = 2;
                // Replace the CallbackProperty with a direct assignment
                // Generate the positions for the polyline
                var positions = Cesium.PolylinePipeline.generateArc({
                    positions: entity.polyline.positions.getValue(Cesium.JulianDate.now()),
                    height: height,
                    granularity: 0.0001
                });
                // Assign the positions directly to the polyline
                entity.polyline.positions = positions;
            }
        });
        return viewer.dataSources.add(dataSource);
    }).otherwise(function(error){
        console.error('Error loading GeoJSON data:', error);
    });
}


// URLs to the GeoJSON data
var oceansGeojsonUrl = 'https://aurashak.github.io/geojson/oceans.geojson'; 
var europeGeojsonUrl = 'https://aurashak.github.io/geojson/europe.json';
var asiaGeojsonUrl = 'https://aurashak.github.io/geojson/asia.json';
var africaGeojsonUrl = 'https://aurashak.github.io/geojson/africa.json';
var oceanaGeojsonUrl = 'https://aurashak.github.io/geojson/oceana.json';
var northamericaGeojsonUrl = 'https://aurashak.github.io/geojson/northamerica.json';
var southamericaGeojsonUrl = 'https://aurashak.github.io/geojson/southamerica.json';
var lakesGeojsonUrl = 'https://aurashak.github.io/geojson/lakes.json';
var riversGeojsonUrl = 'https://aurashak.github.io/geojson/rivers.geojson';


// Load and style the layers
loadAndStyleGeoJson(oceansGeojsonUrl, Cesium.Color.BLACK, Cesium.Color.WHITE, oceanHeight);
loadAndStyleGeoJson(europeGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(asiaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(africaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(oceanaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(northamericaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(southamericaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(lakesGeojsonUrl, Cesium.Color.RED, Cesium.Color.WHITE, lakeRiverHeight);
loadAndStyleGeoJson(riversGeojsonUrl, Cesium.Color.BLUE, Cesium.Color.BLUE, lakeRiverHeight, true);


window.onload = function() {
    var viewer = new Cesium.Viewer('cesiumContainer', {
        // your viewer options
    });

    // Wait for Cesium to fully initialize
    viewer.scene.globe.tileLoadProgressEvent.addEventListener(function () {
        if (viewer.scene.globe.tilesLoaded) {
            // Locate the existing toolbar
            var toolbar = document.getElementsByClassName('cesium-viewer-toolbar')[0];

            // Create or locate a container for the toolbar
            var toolbarContainer = document.createElement('div');
            toolbarContainer.className = 'toolbar-container';
            document.body.appendChild(toolbarContainer);

            // Move the toolbar to the new container
            toolbarContainer.appendChild(toolbar);
            toolbar.className += ' custom-toolbar';
        }
    });
};


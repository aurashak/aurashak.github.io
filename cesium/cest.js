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


// Function to load and style a GeoJSON layer
function loadAndStyleGeoJson(url, color, outlineColor, isRiverLayer = false) {
    Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
        dataSource.entities.values.forEach(function(entity) {
            if (entity.polygon) {
                // Set polygon material to slightly transparent
                entity.polygon.material = color.withAlpha(0.01);
                // Enable the outline for polygons and set it to the specified color
                entity.polygon.outline = false;
                entity.polygon.outlineColor = outlineColor;
            } else if (isRiverLayer && entity.polyline) {
                // Customize river lines
                var riverHexColor = '#6495ED'; // Replace with your desired hex color for blue
                var riverColor = Cesium.Color.fromCssColorString(riverHexColor).withAlpha(0.5); // Set the desired transparency using withAlpha
                entity.polyline.material = riverColor;
                entity.polyline.width = 0.25; // Adjust the width as needed
            }
        });
        viewer.dataSources.add(dataSource);
    }).otherwise(function(error){
        console.error(error);
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
loadAndStyleGeoJson(oceansGeojsonUrl, Cesium.Color.BLACK, Cesium.Color.WHITE);
loadAndStyleGeoJson(europeGeojsonUrl, Cesium.Color.BLACK, Cesium.Color.WHITE);
loadAndStyleGeoJson(asiaGeojsonUrl, Cesium.Color.RED, Cesium.Color.WHITE);
loadAndStyleGeoJson(africaGeojsonUrl, Cesium.Color.RED, Cesium.Color.WHITE);
loadAndStyleGeoJson(oceanaGeojsonUrl, Cesium.Color.RED, Cesium.Color.WHITE);
loadAndStyleGeoJson(northamericaGeojsonUrl, Cesium.Color.RED, Cesium.Color.WHITE);
loadAndStyleGeoJson(southamericaGeojsonUrl, Cesium.Color.RED, Cesium.Color.WHITE);
loadAndStyleGeoJson(lakesGeojsonUrl, Cesium.Color.RED, Cesium.Color.WHITE);
loadAndStyleGeoJson(riversGeojsonUrl, Cesium.Color.RED, null, true); // Custom style for rivers


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



var geojsonUrl = 'https://aurashak.github.io/geojson/projectmarkers.geojson'; // Define the URL

Cesium.GeoJsonDataSource.load(geojsonUrl).then(function(dataSource) {
    viewer.dataSources.add(dataSource);

    var entities = dataSource.entities.values;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];

        // Set the billboard to undefined to ensure it doesn't show
        entity.billboard = undefined;

        // Check if the entity has properties and a marker-color
        if (entity.properties && entity.properties['marker-color']) {
            var color = Cesium.Color.fromCssColorString(entity.properties['marker-color'].getValue());

            // Set the point to be transparent
            entity.point = new Cesium.PointGraphics({
                pixelSize: 0, // Set pixel size to 0 to hide the point
                color: Cesium.Color.TRANSPARENT // Make the point fully transparent
            });

            // Modify the ellipse to create a glowing halo effect
            entity.ellipse = new Cesium.EllipseGraphics({
                semiMinorAxis: 5000, // Adjust size as needed
                semiMajorAxis: 5000, // Adjust size as needed
                height: 10, // Height above the surface
                material: new Cesium.Material({
                    fabric: {
                        type: 'Color',
                        uniforms: {
                            color: color.withAlpha(0.2) // Set a lower alpha for a more diffuse effect
                        }
                    }
                }),
                outline: true, // Set to true to show the outline
                outlineColor: color, // Match the outline color to the marker color
                outlineWidth: 10, // Make the outline thicker
                fill: false // No fill in the center
            });
        }
    }
}).otherwise(function(error) {
    console.error("Error loading GeoJSON data: ", error);
});


// Define a function to update the size of the halos based on the camera height
function updateHaloSizeBasedOnZoom(viewer) {
    var scene = viewer.scene;
    var entities = viewer.entities.values;

    var cameraHeight = scene.camera.positionCartographic.height;
    entities.forEach(function(entity) {
        if (entity.ellipse) {
            // Define a base size for your halo
            var baseSize = 5000; // Adjust base size as needed
            // Define how the size changes with zoom level
            var sizeFactor = cameraHeight / 1000000; // Adjust divisor to control scaling
            var newSize = baseSize * Math.max(sizeFactor, 1); // Prevent size from going below the base size

            // Update the size of the ellipse
            entity.ellipse.semiMinorAxis = newSize;
            entity.ellipse.semiMajorAxis = newSize;
        }
    });
}

// Add an event listener to the camera changed event to update halos on zoom
viewer.camera.changed.addEventListener(function() {
    updateHaloSizeBasedOnZoom(viewer);
});

// Initial update of halos
updateHaloSizeBasedOnZoom(viewer);



// Function to calculate the midpoint for the arc's height
function computeMidpointHeight(start, end, heightFactor) {
    var distance = Cesium.Cartesian3.distance(start, end);
    return distance * heightFactor; // Height of the arc as a fraction of the distance
}

// Function to create an animated arc between two points
function createAnimatedArc(startEntity, endEntity, color, duration) {
    var startPosition = startEntity.position.getValue();
    var endPosition = endEntity.position.getValue();

    var midHeight = computeMidpointHeight(startPosition, endPosition, 0.15); // 15% of the distance

    var arcPositions = new Cesium.SampledPositionProperty();
    arcPositions.addSample(Cesium.JulianDate.now(), startPosition);
    arcPositions.addSample(Cesium.JulianDate.now().addSeconds(duration / 2), Cesium.Cartesian3.fromRadians(
        (Cesium.Cartographic.fromCartesian(startPosition).longitude + Cesium.Cartographic.fromCartesian(endPosition).longitude) / 2,
        (Cesium.Cartographic.fromCartesian(startPosition).latitude + Cesium.Cartographic.fromCartesian(endPosition).latitude) / 2,
        midHeight
    ));
    arcPositions.addSample(Cesium.JulianDate.now().addSeconds(duration), endPosition);

    var arcEntity = viewer.entities.add({
        position: arcPositions,
        polyline: {
            positions: new Cesium.CallbackProperty(function(time, result) {
                return Cesium.PolylinePipeline.generateArc({
                    positions: [startPosition, arcPositions.getValue(time), endPosition],
                    granularity: 0.001
                });
            }, false),
            material: new Cesium.ColorMaterialProperty(color),
            width: 2
        }
    });

    setTimeout(function() {
        viewer.entities.remove(arcEntity); // Remove the arc after duration
    }, duration * 1000);
}



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


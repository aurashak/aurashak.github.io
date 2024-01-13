
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer', {
    // imageryProvider: new Cesium.IonImageryProvider({ assetId: 3954 }), // Commented out to use default imagery
    baseLayerPicker: false,
    geocoder: false,
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


function getTypeFromProperties(properties) {
    // Since properties.featurecla is a ConstantProperty, we need to get its value
    switch (properties.featurecla) {
        case 'Lake':
            return 'Lake';
        case 'Country':
            return 'Country';
        case 'Continent':
            return 'Continent';
        case 'River':
            return 'River';
        case 'Region':
            return 'Region';
        case 'Subregion':
            return 'Subregion';
        // Add more cases as needed for other feature classes
        default:
            // Return the value of 'featurecla' if it's not one of the standard types you handle
            // or return 'Unknown' if you want to mask unknown types.
            return properties.featurecla || 'Unknown';
    }
}





function showCoordinates(movement) {
    var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
    var pickedObjects = viewer.scene.drillPick(movement.endPosition);

    if (cartesian) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
        var hoverText = 'Latitude: ' + latitudeString + '°, Longitude: ' + longitudeString + '°';

        pickedObjects.forEach(function(pickedObject) {
            if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
                var properties = pickedObject.id.properties;
                var type = getTypeFromProperties(properties);
                var nameProperty = properties.name; // Adjusted for simplicity, assuming 'name' is the correct property
        
                // Since nameProperty is a ConstantProperty, we need to get its value
                var name = Cesium.defined(nameProperty) ? nameProperty.getValue() : 'N/A';
        
                hoverText += `<br>${type}: ${name}`;
            }
        });
        
        coordsBox.innerHTML = hoverText;
        coordsBox.style.display = 'block';
    }
}

viewer.screenSpaceEventHandler.setInputAction(showCoordinates, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

handler.setInputAction(showCoordinates, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


// Additionally, you may want to set up an event listener for when the mouse leaves the globe
// to set the coordsBox to the default text
viewer.scene.canvas.addEventListener('mouseleave', function() {
    coordsBox.innerHTML = defaultText;
    coordsBox.style.display = 'block';
});


// Define heights for different layer types
var continentHeight = 500; // Adjust as needed
var oceansHeight = 500; // Adjust as needed
var lakesHeight = 700; // Adjust as needed
var regionsHeight = 600; // Adjust as needed


// Function to load and style a GeoJSON layer
function loadAndStyleGeoJson(url, color, outlineColor, height = 0, isRiverLayer = false, isCountryLayer = false, isOceanLayer = false, isRegionsLayer = false) {    Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
        dataSource.entities.values.forEach(function(entity) {
            if (entity.polygon) {
                if (isRegionsLayer) {
                    // Custom styling for regions
                    entity.polygon.material = color.withAlpha(1); // Semi-transparent
                    entity.polygon.outline = false; // With outline
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height; // Extruded height if needed
                } else if (isCountryLayer) {
                    // Custom styling for continents
                    entity.polygon.material = color.withAlpha(1); // Semi-transparent
                    entity.polygon.outline = true; // With outline
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height; // Extruded height if needed
                } else if (isOceanLayer) {
                    // Custom styling for oceans
                    entity.polygon.material = color.withAlpha(0.01); // More transparency for water
                    entity.polygon.outline = false; // With outline
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height; // Extruded height for lakes if needed
                    // Oceans typically do not need extrusion
                } else {
                    // Default styling for other polygon layers (like lakes)
                    entity.polygon.material = color.withAlpha(1); // Semi-transparent
                    entity.polygon.outline = false; // No outline for lakes
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height; // Extruded height for lakes if needed
                }
            } else if (isRiverLayer && entity.polyline) {
                // Custom styling for rivers
                var riverColor = Cesium.Color.fromCssColorString('#6495ED').withAlpha(1); // Stronger color for visibility
                var offsetHeight = 10; // Height offset above the ground in meters
            
                entity.polyline.material = riverColor;
                entity.polyline.width = 10; // Wider lines for rivers
                entity.polyline.clampToGround = true; // Clamp the polyline to the ground
                entity.polyline.arcType = Cesium.ArcType.GEODESIC; // Follow the curvature of the Earth
            
                // No need to manually update the polyline positions if clamping to ground
                // Instead, apply a height offset to each position
                entity.polyline.positions = new Cesium.CallbackProperty(function() {
                    var cartographicPositions = entity.polyline.positions.getValue().map(function(position) {
                        var cartographic = Cesium.Cartographic.fromCartesian(position);
                        return Cesium.Cartesian3.fromDegrees(
                            Cesium.Math.toDegrees(cartographic.longitude),
                            Cesium.Math.toDegrees(cartographic.latitude),
                            cartographic.height + offsetHeight
                        );
                    });
                    return cartographicPositions;
                }, false);
            }
            
        });
        viewer.dataSources.add(dataSource);
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
var antarcticaGeojsonUrl = 'https://aurashak.github.io/geojson/antarctica.geojson';
var lakesGeojsonUrl = 'https://aurashak.github.io/geojson/lakes.json';
var regionsGeojsonUrl = 'https://aurashak.github.io/geojson/regions.geojson';
var riversGeojsonUrl = 'https://aurashak.github.io/geojson/rivers.geojson';

// Load and style the layers
loadAndStyleGeoJson(oceansGeojsonUrl, Cesium.Color.RED.withAlpha(1), Cesium.Color.WHITE, oceansHeight, false, false, true); // For oceans
loadAndStyleGeoJson(regionsGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, regionsHeight, false, false, false, true); // For regions
loadAndStyleGeoJson(europeGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Europe
loadAndStyleGeoJson(asiaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Asia, set isCountryLayer to true
loadAndStyleGeoJson(africaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Africa, set isCountryLayer to true
loadAndStyleGeoJson(oceanaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Oceania, set isCountryLayer to true
loadAndStyleGeoJson(northamericaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For North America, set isCountryLayer to true
loadAndStyleGeoJson(southamericaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For South America, set isCountryLayer to true
loadAndStyleGeoJson(antarcticaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Antarctica
loadAndStyleGeoJson(lakesGeojsonUrl, Cesium.Color.BLUE.withAlpha(1), Cesium.Color.WHITE, lakesHeight); // For lakes
loadAndStyleGeoJson(riversGeojsonUrl, Cesium.Color.BLUE.withAlpha(1), Cesium.Color.BLUE, true); // For rivers



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


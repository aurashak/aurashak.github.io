
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer', {
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

// Remove the existing Bing Maps imagery layer
viewer.imageryLayers.remove(viewer.imageryLayers.get(0));


// Add the Sentinel imagery layer
viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }));

viewer.imageryLayers.get(0).brightness = 1.2;
viewer.imageryLayers.get(0).contrast = 1.2;

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
    }
});

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

var defaultText = 'Latitude: Longitude: <br>Place: ';
var coordsBox = document.getElementById('coordsBox');
coordsBox.innerHTML = defaultText;
coordsBox.style.display = 'block';

function getTypeFromProperties(properties) {
    switch (properties.featurecla) {
        case 'Lake':
            return 'Lake';
        case 'Admin-0 country':
            return 'Country';
        case 'continent':
            return 'Continent';
        case 'River':
            return 'River';
        case 'Region':
            return 'Region';
        case 'Subregion':
            return 'Subregion';
        default:
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
                var name = properties.name;

                if (name) {
                    hoverText += `<br>${type}: ${name}`;
                } else {
                    hoverText += `<br>${type}: N/A`;
                }
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


// Define colors and heights for different layers
var layerStyles = {
    oceans: {
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        height: 500 // Adjust as needed
    },
    regions: {
        color: Cesium.Color.KHAKI,
        outlineColor: Cesium.Color.GREEN,
        height: 600 
    },
    europe: {
        color: Cesium.Color.KHAKI,
        outlineColor: Cesium.Color.BLACK,
        height: 500 
    },
    asia: {
        color: Cesium.Color.KHAKI,
        outlineColor: Cesium.Color.BLACK,
        height: 500 
    },
    africa: {
        color: Cesium.Color.KHAKI,
        outlineColor: Cesium.Color.BLACK,
        height: 500 
    },
    oceania: {
        color: Cesium.Color.KHAKI,
        outlineColor: Cesium.Color.BLACK,
        height: 500
    },
    northamerica: {
        color: Cesium.Color.KHAKI,
        outlineColor: Cesium.Color.BLACK,
        height: 500
    },
    southamerica: {
        color: Cesium.Color.KHAKI,
        outlineColor: Cesium.Color.BLACK,
        height: 500
    },
    antarctica: {
        color: Cesium.Color.KHAKI,
        outlineColor: Cesium.Color.BLACK,
        height: 500
    },
    lakes: {
        color: Cesium.Color.BLUE,
        outlineColor: Cesium.Color.WHITE,
        height: 700 // Adjust as needed
    },
    cities: {
        color: Cesium.Color.BLACK,
        outlineColor: Cesium.Color.BLACK,
        height: 800 // Adjust as needed
    },
    statesprovinces: { // New states/provinces layer configuration
        color: Cesium.Color.ORANGE,
        outlineColor: Cesium.Color.BLACK,
        height: 550 // Adjust as needed for states/provinces
    },
    graticule: { // New graticule layer configuration
        color: Cesium.Color.DARKGRAY, // Color for the graticule lines
        height: 1000 // Adjust as needed for graticule
    }
};

// Function to load and style a GeoJSON layer
function loadAndStyleGeoJson(layerName, url, isRiverLayer, isCountryLayer, isOceanLayer, isRegionsLayer, isCitiesLayer, isGraticuleLayer) {
    var layerStyle = layerStyles[layerName];
    var color = layerStyle.color;
    var outlineColor = layerStyle.outlineColor;
    var height = layerStyle.height;

    Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
        dataSource.entities.values.forEach(function(entity) {
            if (entity.polygon) {
                if (isRegionsLayer || isCountryLayer || isOceanLayer || isStatesProvincesLayer) {
                    entity.polygon.material = color.withAlpha(0.01);
                    entity.polygon.outline = true;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.allowPicking = false; 
                    entity.polygon.extrudedHeight = height;
                } else if (isCitiesLayer) {
                    entity.polygon.material = color.withAlpha(0.7);
                    entity.polygon.outline = true;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.allowPicking = false; 
                    entity.polygon.extrudedHeight = height;
                } else {
                    entity.polygon.material = color.withAlpha(0.01);
                    entity.polygon.outline = false;
                    entity.polygon.allowPicking = false; 
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                }
            } else if (isRiverLayer && entity.polyline) {
                var riverColor = Cesium.Color.BLUE;
                var offsetHeight = 10;
                entity.polyline.material = riverColor;
                entity.polyline.width = 3;
                entity.polyline.clampToGround = true;
                entity.polyline.arcType = Cesium.ArcType.GEODESIC;
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
            } else if (isGraticuleLayer && entity.polyline) { // Check for graticule layer
                var graticuleColor = layerStyles.graticule.color;
                entity.polyline.material = graticuleColor;
                entity.polyline.width = 2; // Adjust the width of graticule lines as needed
                entity.polygon.extrudedHeight = height;
            }
        });

        viewer.dataSources.add(dataSource);
    }).otherwise(function(error){
        console.error('Error loading GeoJSON data:', error);
    });
}

// URLs to the GeoJSON data
var oceansGeojsonUrl = 'https://aurashak.github.io/geojson/world/oceans.geojson'; 
var europeGeojsonUrl = 'https://aurashak.github.io/geojson/world/europe.json';
var asiaGeojsonUrl = 'https://aurashak.github.io/geojson/world/asia.json';
var africaGeojsonUrl = 'https://aurashak.github.io/geojson/world/africa.json';
var oceaniaGeojsonUrl = 'https://aurashak.github.io/geojson/world/oceania.json';
var northamericaGeojsonUrl = 'https://aurashak.github.io/geojson/world/northamerica.json';
var southamericaGeojsonUrl = 'https://aurashak.github.io/geojson/world/southamerica.json';
var antarcticaGeojsonUrl = 'https://aurashak.github.io/geojson/world/antarctica.geojson';
var lakesGeojsonUrl = 'https://aurashak.github.io/geojson/world/lakes.json';
var citiesGeojsonUrl = 'https://aurashak.github.io/geojson/world/cities.geojson';
var statesProvincesGeojsonUrl = 'https://aurashak.github.io/geojson/world/statesprovinces.json'; // New states/provinces GeoJSON URL
var graticuleGeojsonUrl = 'https://aurashak.github.io/world/graticule.geojson'; // New graticule GeoJSON URL

// Load and style the layers
loadAndStyleGeoJson('oceans', oceansGeojsonUrl, false, false, true); // For oceans
loadAndStyleGeoJson('regions', regionsGeojsonUrl, false, false, false, true); // For regions
loadAndStyleGeoJson('europe', europeGeojsonUrl, false, true); // For Europe
loadAndStyleGeoJson('asia', asiaGeojsonUrl, false, true); // For Asia, set isCountryLayer to true
loadAndStyleGeoJson('africa', africaGeojsonUrl, false, true); // For Africa, set isCountryLayer to true
loadAndStyleGeoJson('oceania', oceaniaGeojsonUrl, false, true); // For Oceania, set isCountryLayer to true
loadAndStyleGeoJson('northamerica', northamericaGeojsonUrl, false, true); // For North America, set isCountryLayer to true
loadAndStyleGeoJson('southamerica', southamericaGeojsonUrl, false, true); // For South America, set isCountryLayer to true
loadAndStyleGeoJson('antarctica', antarcticaGeojsonUrl, false, true); // For Antarctica
loadAndStyleGeoJson('lakes', lakesGeojsonUrl); // For lakes
loadAndStyleGeoJson('rivers', riversGeojsonUrl, true); // For rivers
loadAndStyleGeoJson('cities', citiesGeojsonUrl, false, false, false, false, true);
loadAndStyleGeoJson('statesprovinces', statesProvincesGeojsonUrl); // Load and style states/provinces layer
loadAndStyleGeoJson('graticule', graticuleGeojsonUrl, false, false, false, false, false, true); // Load and style gr


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


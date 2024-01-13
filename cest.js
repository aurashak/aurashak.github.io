
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
        case 'Country':
            return 'Country';
        case 'continent':
            return 'Continent';
        case 'River':
            return 'River';
        case 'REGION':
            return 'Region';
        case 'SUBREGION':
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
    oceans: { color: Cesium.Color.BLUE, outlineColor: Cesium.Color.WHITE, height: 500 },
    regions: { color: Cesium.Color.KHAKI, outlineColor: Cesium.Color.GREEN, height: 600 },
    europe: { color: Cesium.Color.KHAKI, outlineColor: Cesium.Color.BLACK, height: 500 },
    asia: { color: Cesium.Color.KHAKI, outlineColor: Cesium.Color.BLACK, height: 500 },
    africa: { color: Cesium.Color.KHAKI, outlineColor: Cesium.Color.BLACK, height: 500 },
    oceania: { color: Cesium.Color.KHAKI, outlineColor: Cesium.Color.BLACK, height: 500 },
    northamerica: { color: Cesium.Color.KHAKI, outlineColor: Cesium.Color.BLACK, height: 500 },
    southamerica: { color: Cesium.Color.KHAKI, outlineColor: Cesium.Color.BLACK },
    antarctica: { color: Cesium.Color.KHAKI, outlineColor: Cesium.Color.BLACK, height: 500 },
    lakes: { color: Cesium.Color.BLUE, outlineColor: Cesium.Color.WHITE, height: 700 },
    cities: { color: Cesium.Color.BLACK, outlineColor: Cesium.Color.BLACK, height: 800 },
    statesprovinces: { color: Cesium.Color.ORANGE, outlineColor: Cesium.Color.BLACK, height: 550 }
};

// Function to load and style a GeoJSON layer
function loadAndStyleGeoJson(layerName, url) {
    var layerStyle = layerStyles[layerName];
    var color = layerStyle.color;
    var outlineColor = layerStyle.outlineColor;
    var height = layerStyle.height;


    console.log('Loading GeoJSON for layer:', layerName);

    Cesium.GeoJsonDataSource.load(url).then(function (dataSource) {

        console.log('GeoJSON loaded for layer:', layerName);

        dataSource.entities.values.forEach(function (entity) {
            if (entity.polygon || entity.polyline) {
                entity.material = color.withAlpha(1);
                entity.outline = true;
                entity.outlineColor = outlineColor;
                if (entity.polygon) {
                    entity.polygon.extrudedHeight = height;
                }
            }
        });

        viewer.dataSources.add(dataSource);
        console.log('Added GeoJSON to viewer for layer:', layerName);
    }).otherwise(function (error) {
        console.error('Error loading GeoJSON data:', error);
    });
}

// URLs to the GeoJSON data
var oceansGeojsonUrl = 'https://aurashak.github.io/geojson/world/oceans.geojson'; 
var regionsGeojsonUrl = 'https://aurashak.github.io/geojson/world/regions.geojson';
var europeGeojsonUrl = 'https://aurashak.github.io/geojson/world/europe.json';
var asiaGeojsonUrl = 'https://aurashak.github.io/geojson/world/asia.json';
var africaGeojsonUrl = 'https://aurashak.github.io/geojson/world/africa.json';
var oceaniaGeojsonUrl = 'https://aurashak.github.io/geojson/world/oceania.json';
var northamericaGeojsonUrl = 'https://aurashak.github.io/geojson/world/northamerica.json';
var southamericaGeojsonUrl = 'https://aurashak.github.io/geojson/world/southamerica.json';
var antarcticaGeojsonUrl = 'https://aurashak.github.io/geojson/world/antarctica.geojson';
var lakesGeojsonUrl = 'https://aurashak.github.io/geojson/world/lakes.json';
var citiesGeojsonUrl = 'https://aurashak.github.io/geojson/world/cities.geojson';
var statesprovincesGeojsonUrl = 'https://aurashak.github.io/geojson/world/statesprovinces.json';

// Load and style the layers
loadAndStyleGeoJson('oceans', oceansGeojsonUrl);
loadAndStyleGeoJson('regions', regionsGeojsonUrl);
loadAndStyleGeoJson('europe', europeGeojsonUrl);
loadAndStyleGeoJson('asia', asiaGeojsonUrl);
loadAndStyleGeoJson('africa', africaGeojsonUrl);
loadAndStyleGeoJson('oceania', oceaniaGeojsonUrl);
loadAndStyleGeoJson('northamerica', northamericaGeojsonUrl);
loadAndStyleGeoJson('southamerica', southamericaGeojsonUrl);
loadAndStyleGeoJson('antarctica', antarcticaGeojsonUrl);
loadAndStyleGeoJson('lakes', lakesGeojsonUrl);
loadAndStyleGeoJson('rivers', riversGeojsonUrl);
loadAndStyleGeoJson('cities', citiesGeojsonUrl);
loadAndStyleGeoJson('statesprovinces', statesprovincesGeojsonUrl);





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


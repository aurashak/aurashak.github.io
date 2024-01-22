var mainViewer;

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';


// Function to set up synchronization when mainViewer is ready
function setUpSynchronization() {
    mainViewer = new Cesium.Viewer('cesiumContainer2', {    
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

    mainViewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 0.0
        }
    });

    mainViewer.camera.percentageChanged = 0.01; // Adjust this threshold as needed

    // Function to rotate the globe slowly
    function rotateGlobe() {
        if (isRotating) {
            mainViewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
        }
    }

    // Slow down the rotation
    var spinRate = 0.0003;
    var isRotating = true; // To keep track of the rotation state

   

// Define heights for different layer types
var continentHeight = 500; // Adjust as needed
var oceansHeight = 500; // Adjust as needed
var lakesHeight = 700; // Adjust as needed
var regionsHeight = 600; // Adjust as needed
var citiesHeight = 800; // Adjust as needed

// Function to load and style a GeoJSON layer
function loadAndStyleGeoJson(url, color, outlineColor, height, isRiverLayer, isCountryLayer, isOceanLayer, isRegionsLayer, isCitiesLayer) {
    Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
        dataSource.entities.values.forEach(function(entity) {
            if (entity.polygon) {
                if (isRegionsLayer) {
                    entity.polygon.material = color.withAlpha(0.01);
                    entity.polygon.outline = true;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                } else if (isCountryLayer) {
                    entity.polygon.material = color.withAlpha(0.01);
                    entity.polygon.outline = true;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                } else if (isOceanLayer) {
                    entity.polygon.material = color.withAlpha(0.01);
                    entity.polygon.outline = false;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                } else if (isCitiesLayer) {
                    entity.polygon.material = color.withAlpha(1);
                    entity.polygon.outline = true;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                } else {
                    entity.polygon.material = color.withAlpha(0.01);
                    entity.polygon.outline = false;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                }
            } else if (isRiverLayer && entity.polyline) {
                var riverColor = Cesium.Color.fromCssColorString('#6495ED').withAlpha(1);
                var offsetHeight = 10;
                entity.polyline.material = riverColor;
                entity.polyline.width = 10;
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
            }
        });

        mainViewer.dataSources.add(dataSource);
    }).otherwise(function(error){
        console.error('Error loading GeoJSON data:', error);
    });
}

// URLs to the GeoJSON data
var oceansGeojsonUrl = 'https://aurashak.github.io/geojson/world/oceans.geojson'; 
var europeGeojsonUrl = 'https://aurashak.github.io/geojson/world/europe.json';
var asiaGeojsonUrl = 'https://aurashak.github.io/geojson/world/asia.json';
var africaGeojsonUrl = 'https://aurashak.github.io/geojson/world/africa.json';
var oceanaGeojsonUrl = 'https://aurashak.github.io/geojson/world/oceana.json';
var northamericaGeojsonUrl = 'https://aurashak.github.io/geojson/world/northamerica.json';
var southamericaGeojsonUrl = 'https://aurashak.github.io/geojson/world/southamerica.json';
var antarcticaGeojsonUrl = 'https://aurashak.github.io/geojson/world/antarctica.geojson';
var lakesGeojsonUrl = 'https://aurashak.github.io/geojson/world/lakes.json';
var regionsGeojsonUrl = 'https://aurashak.github.io/geojson/world/regions.geojson';
var riversGeojsonUrl = 'https://aurashak.github.io/geojson/world/rivers.geojson';
var citiesGeojsonUrl = 'https://aurashak.github.io/geojson/world/cities.geojson';

// Load and style the layers
mainViewer.readyPromise.then(function () {
    loadAndStyleGeoJson(oceansGeojsonUrl, Cesium.Color.RED.withAlpha(1), Cesium.Color.WHITE, oceansHeight, false, false, true); // For oceans
    loadAndStyleGeoJson(regionsGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, regionsHeight, false, false, false, true); // For regions
    loadAndStyleGeoJson(europeGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Europe
    loadAndStyleGeoJson(asiaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Asia, set isCountryLayer to true
    loadAndStyleGeoJson(africaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Africa, set isCountryLayer to true
    loadAndStyleGeoJson(oceanaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Oceania, set isCountryLayer to true
    loadAndStyleGeoJson(northamericaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For North America, set isCountryLayer to true
    loadAndStyleGeoJson(southamericaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For South America, set isCountryLayer to true
    loadAndStyleGeoJson(antarcticaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Antarctica
    loadAndStyleGeoJson(lakesGeojsonUrl, Cesium.Color.BLUE.withAlpha(0.01), Cesium.Color.WHITE, lakesHeight); // For lakes
    loadAndStyleGeoJson(riversGeojsonUrl, Cesium.Color.BLUE.withAlpha(0.01), Cesium.Color.BLUE, true); // For rivers
    loadAndStyleGeoJson(citiesGeojsonUrl, Cesium.Color.BLUE.withAlpha(1), Cesium.Color.BLUE, citiesHeight, false, false, false, false, true);
});

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var imageryViewModels = [
    // ESRI World Imagery layer
    new Cesium.ProviderViewModel({
        name: 'ESRI World Imagery',
        iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/esriWorldImagery.png'),
        tooltip: 'ESRI World Imagery provided by ArcGIS Online',
        creationFunction: function() {
            return new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            });
        }
    }),
    // OpenStreetMap layer
    new Cesium.ProviderViewModel({
        name: 'OpenStreetMap',
        iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
        tooltip: 'OpenStreetMap (OSM)',
        creationFunction: function() {
            return new Cesium.OpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
            });
        }
    }),
    // Natural Earth II layer
    new Cesium.ProviderViewModel({
        name: 'Natural Earth II',
        iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/naturalEarthII.png'),
        tooltip: 'Natural Earth II, light-colored base map with fine detail',
        creationFunction: function() {
            return new Cesium.TileMapServiceImageryProvider({
                url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
            });
        }
    })
];

var terrainViewModels = [
    // Cesium World Terrain layer
    new Cesium.ProviderViewModel({
        name: 'Cesium World Terrain',
        iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
        tooltip: 'Cesium World Terrain, high-resolution global terrain model',
        creationFunction: function() {
            return Cesium.createWorldTerrain();
        }
    })
];

// Create the viewer with the desired options
var viewer = new Cesium.Viewer('cesiumContainer', {
    skyBox: false,
    skyAtmosphere: false,
    timeline: false,
    homeButton: false,
    navigationHelpButton: false,
    geocoder: true,
    fullscreenButton: false,
    sceneModePicker: true,
    baseLayerPicker: true,
    animation: false,
    vrButton: false,
    infoBox: true,
    imageryProvider: false, // Disable the default imagery layer
    terrainProvider: false, // Disable the default terrain layer
    imageryProviderViewModels: imageryViewModels,
    terrainProviderViewModels: terrainViewModels
});

// Load a GeoJSON file from a URL
var geoJsonUrl = 'https://aurashak.github.io/geojson/projectmarkers.geojson';
viewer.dataSources.add(Cesium.GeoJsonDataSource.load(geoJsonUrl, {
    stroke: Cesium.Color.fromCssColorString('#fff').withAlpha(1),
    fill: Cesium.Color.fromCssColorString('#3b3b3b').withAlpha(1),    
    strokeWidth: .25
}));


// Add a handler for mouse move events to display feature name and lat/long
var hoverHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

hoverHandler.setInputAction(function (movement) {
    var infoBoxText = ''; // This will hold the names of the features (country, lake, or river)
    var pickedObjects = viewer.scene.drillPick(movement.endPosition);
    
    // Store unique names to avoid duplicates if entities overlap
    var uniqueNames = new Set();

    // Iterate over all picked objects to get names of the features
    for (var i = 0; i < pickedObjects.length; i++) {
        var entity = pickedObjects[i].id;
        if (Cesium.defined(entity) && entity.properties && entity.properties.name) {
            uniqueNames.add(entity.properties.name.getValue());
        }
    }

    // Join all unique feature names
    if (uniqueNames.size > 0) {
        infoBoxText = Array.from(uniqueNames).join(', ');
    }

    // Update the info box with the feature names and coordinates
    if (infoBoxText !== '') {
        // Get the cartesian position of the mouse pointer on the globe
        var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
        if (cartesian) {
            // Convert cartesian to cartographic coordinates (radians)
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            // Convert radians to degrees and show latitude/longitude
            var latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
            infoBoxText += ` | Lat: ${latitude}, Long: ${longitude}`;
        }
    } else {
        infoBoxText = 'World';
    }
    
    // Display the information
    document.getElementById('infoBox').textContent = infoBoxText;

}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);



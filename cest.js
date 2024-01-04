Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

// Create the viewer with the desired options
var viewer = new Cesium.Viewer('cesiumContainer', {
    skyBox: false,
    skyAtmosphere: false,
    timeline: false,
    homeButton: false,
    navigationHelpButton: false,
    geocoder: true,
    fullscreenButton: true,
    sceneModePicker: true,
    baseLayerPicker: true,
    animation: true,
    vrButton: true,
    infoBox: true,
    imageryProvider: true, // Disable the default imagery layer
    terrainProvider: true, // Disable the default terrain layer
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



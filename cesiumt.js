document.addEventListener('DOMContentLoaded', function() {
    // Your access token from Cesium ion (ensure this token is kept private)
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';
  
    const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain(),
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        skyBox: false,
        skyAtmosphere: false,
        useDefaultRenderLoop: true,
        // Do not disable the zoom controls
    });

    // Override the default imagery with a solid color or a simple imagery provider
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(new Cesium.ColorImageryProvider({
        color: Cesium.Color.WHITE
    }));

    // Restore the zoom and tilt gestures
    viewer.scene.screenSpaceCameraController.enableZoom = true;
    viewer.scene.screenSpaceCameraController.enableTilt = true;
    viewer.scene.screenSpaceCameraController.enableRotate = true;

    // Ensure pinch zoom is enabled for touch devices
    viewer.scene.screenSpaceCameraController.enablePinchZoom = true;
});

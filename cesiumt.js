document.addEventListener('DOMContentLoaded', function() {
    // Your access token from Cesium ion (ensure this token is kept private)
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';
  
    const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain(),
        animation: false, // Don't show the animation widget
        baseLayerPicker: false, // Don't show the base layer picker
        fullscreenButton: false, // Don't show the full screen button
        vrButton: false, // Don't show VR button
        geocoder: false, // Don't show the geocoder widget
        homeButton: false, // Don't show the home button
        infoBox: false, // Don't show the info box
        sceneModePicker: false, // Don't show the scene mode picker
        selectionIndicator: false, // Don't show the selection indicator
        timeline: false, // Don't show the timeline
        navigationHelpButton: false, // Don't show the navigation help button
        skyBox: false, // Don't show the skybox (this removes stars)
        skyAtmosphere: false, // Don't show the atmosphere
        useDefaultRenderLoop: true,
        zoomControl: false, // Optionally remove the zoom control
    });

    viewer.scene.backgroundColor = Cesium.Color.WHITE; // Set the background color to white
});

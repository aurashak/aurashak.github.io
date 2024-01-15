document.addEventListener("DOMContentLoaded", function () {
    // Your Cesium code here
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmE0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

    // Initialize Cesium Viewer
    var viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain(),
    });

    // Add a simple entity (marker) on the globe
    viewer.entities.add({
        name: 'Sample Location',
        position: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 0),
        point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
        },
    });

    // Set the camera view to a specific location and zoom level
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 1000000),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-45.0),
            roll: 0.0,
        },
    });
});

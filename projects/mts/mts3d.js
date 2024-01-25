Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjljMGQ4MS0zNzJkLTQxMjItODk1OC03ZDkwM2VkYzYwMDUiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDYxNTcwNDJ9.9AcXXdl9PUpvx5y-XBR81kIHSjjfRbY6wDM-JPVPCZo';

var viewer = new Cesium.Viewer('mtsmap', {
    terrainProvider: Cesium.createWorldTerrain(),

    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: true,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false,
    skyBox: false, // Disable the skybox
    skyAtmosphere: false, // Disable the sky atmosphere
    scene3DOnly: false,
    sceneMode: Cesium.SceneMode.SCENE3D,
});


    var osm3D = viewer.scene.primitives.add(Cesium.createOsmBuildings());


    // Set the camera to focus slightly further west, facing east, and at a closer zoom
    viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-73.97421308903137, 40.820382982431454, 500.0), // Adjusted coordinates and altitude
        orientation: {
            heading: Cesium.Math.toRadians(90),  
            pitch: Cesium.Math.toRadians(-25),   
            roll: Cesium.Math.toRadians(0)
        }
    });






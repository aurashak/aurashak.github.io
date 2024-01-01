// Your access token from Cesium ion (ensure this token is kept private)
Cesium.Ion.defaultAccessToken = 'your_cesium_ion_access_token';

// Create a new Cesium Viewer in the div with the ID 'cesiumContainer'
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain()
});


// Your access token from Cesium ion (ensure this token is kept private)
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjAyN2RmMC05ZDQxLTQwM2YtOWZiZC1hMTI5ZDZlMDgyMGIiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDM4MzA3Njh9.5yn30zsnLQltPUj52_wu8sNHKKNeHkGVi267uKmzI3Q';

// Create a new Cesium Viewer in the div with the ID 'cesiumContainer'
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain()
});

// Optionally load a GeoJSON file
viewer.dataSources.add(Cesium.GeoJsonDataSource.load('https://aurashak.github.io/geojson/countries.geojson', {
  stroke: Cesium.Color.WHITE,
  fill: Cesium.Color.BLACK.withAlpha(0.5),
  strokeWidth: 1
})).then(function(dataSource) {
  viewer.zoomTo(dataSource); // Zoom to the GeoJSON data
});

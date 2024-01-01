document.addEventListener('DOMContentLoaded', function() {
    // Your access token from Cesium ion (ensure this token is kept private)
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';
  
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
  });
  
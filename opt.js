var map = new ol.Map({
  target: 'mapid',  // Make sure this matches the ID of your map container
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]), // Longitude and latitude of the initial center of the map
    zoom: 4  // Initial zoom level
  })
});

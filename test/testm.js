var countryStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'black' // Color of countries
    }),
    stroke: new ol.style.Stroke({
      color: 'black', // Color of country borders
      width: 1
    })
  });
  
  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'https://aurashak.github.io/geojson/countries.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: countryStyle
  });
  
  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      vectorLayer
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([0, 0]),
      zoom: 2
    })
  });
  
  // Set the map background to white which will style the oceans
  map.on('postrender', function() {
    map.getViewport().style.background = 'white';
  });
  
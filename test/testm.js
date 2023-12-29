var map = new ol.Map({
    target: 'map',
    layers: [
      // Stamen Terrain Background layer
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://stamen-tiles.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png',
          attributions: [
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
            '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
            'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
          ],
          maxZoom: 18
        })
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-74.0060, 40.7128]), // Coordinates for New York City
      zoom: 11 // Adjusted zoom level
    })
  });
  
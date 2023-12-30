var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: [0, 0],
        projection: 'EPSG:3857', // This is the default Web Mercator projection
        zoom: 2
    })
});

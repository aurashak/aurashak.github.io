document.addEventListener('DOMContentLoaded', function() {
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]), // Change to your desired center
            zoom: 2 // Change to your desired initial zoom level
        })
    });
});

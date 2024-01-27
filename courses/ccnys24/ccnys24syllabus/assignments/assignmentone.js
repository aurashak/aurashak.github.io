document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('assignmentonemap').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            remove: false
        },
        draw: {
            marker: true,
            circle: false,
            circlemarker: false,
            polygon: true,
            polyline: false,
            rectangle: false
        }
    });

    map.addControl(drawControl);

    map.on('draw:created', function (e) {
        var layer = e.layer;

        if (layer instanceof L.Marker) {
            // Handle marker creation
            var title = prompt('Enter marker title:', 'Marker Title');
            layer.bindPopup(title);
        } else if (layer instanceof L.Polygon) {
            // Handle polygon creation
            var title = prompt('Enter polygon title:', 'Polygon Title');
            layer.bindPopup(title);
        }

        drawnItems.addLayer(layer);
    });
});

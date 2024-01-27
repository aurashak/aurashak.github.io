document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('assignmentonemap').setView([40.7128, -74.0060], 12); // Set your initial view

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
            marker: false,
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
        drawnItems.addLayer(layer);
    });

    window.addUserMarker = function() {
        var description = document.getElementById('markerDescription').value;
        var color = document.getElementById('markerColor').value;

        var marker = L.marker(map.getCenter(), {
            icon: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background-color: ' + color + ';" class="marker-popup">' + description + '</div>',
                iconSize: [30, 30]
            })
        });

        marker.bindPopup(description);
        map.addLayer(marker);

        // Optionally, you can clear the form after adding the marker
        document.getElementById('markerDescription').value = '';
    };
});

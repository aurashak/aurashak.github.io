document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('assignmentonemap').setView([40.7128, -74.0060], 12);

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

    // Load existing markers from localStorage
    loadMarkersFromStorage();

    map.on('draw:created', function (e) {
        var layer = e.layer;
        drawnItems.addLayer(layer);

        // Save the marker to localStorage
        saveMarkerToStorage(layer);
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

        // Save the marker to localStorage
        saveMarkerToStorage(marker);

        // Optionally, you can clear the form after adding the marker
        document.getElementById('markerDescription').value = '';
    };

    // Prevent form submission and call addUserMarker function
    document.getElementById('userMarkerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addUserMarker();
    });

    function saveMarkerToStorage(marker) {
        // Retrieve existing markers from localStorage
        var existingMarkers = JSON.parse(localStorage.getItem('markers')) || [];

        // Add the new marker to the array
        existingMarkers.push({
            latlng: marker.getLatLng(),
            description: marker.getPopup().getContent(),
        });

        // Save the updated array back to localStorage
        localStorage.setItem('markers', JSON.stringify(existingMarkers));
    }

    function loadMarkersFromStorage() {
        // Retrieve existing markers from localStorage
        var existingMarkers = JSON.parse(localStorage.getItem('markers')) || [];

        // Add each marker to the map
        existingMarkers.forEach(function(markerData) {
            var marker = L.marker(markerData.latlng, {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: '<div class="marker-popup">' + markerData.description + '</div>',
                    iconSize: [30, 30]
                })
            });

            marker.bindPopup(markerData.description);
            map.addLayer(marker);
        });
    }
});

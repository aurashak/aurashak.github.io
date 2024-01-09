document.addEventListener('DOMContentLoaded', function() {
    var mymap = L.map('mapid').setView([0, 0], 2.7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mymap);

    function selectIcon(feature) {
        // Use a single class for all markers
        return L.divIcon({
            className: 'basic-marker',
            html: '<div></div>',
            iconSize: L.point(20, 20),  // Size of the icon
            iconAnchor: [10, 10]        // Position of the icon
        });
    }

    function addProjectMarkers() {
        fetch('https://aurashak.github.io/geojson/projectmarkers.geojson')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    pointToLayer: function(feature, latlng) {
                        return L.marker(latlng, { icon: selectIcon(feature) });
                    }
                }).addTo(mymap);
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
            });
    }

    addProjectMarkers();
});

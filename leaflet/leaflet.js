document.addEventListener('DOMContentLoaded', function() {
    var mymap = L.map('mapid').setView([0, 0], 2.7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mymap);

    function selectIcon(feature) {
        var className = 'pulsating-marker'; // Base class for all markers

        switch (feature.properties['marker-color']) {
            case '#FF0000':
                className += ' red';
                break;
            case '#00FF00':
                className += ' green';
                break;
            case '#7F00FF':
                className += ' violet';
                break;
            case '#FFFF00':
                className += ' yellow';
                break;
            default:
                className += ''; // No additional class for default
        }

        return L.divIcon({
            className: className,
            html: '<div></div>',
            iconSize: L.point(10, 10),  // Adjust if necessary
            iconAnchor: [10, 10]        // Adjust if necessary
        });
        
    }

    function addProjectMarkers() {
        fetch('https://aurashak.github.io/geojson/projectmarkers.geojson')
            .then(response => response.json())
            .then(data => {
                console.log('GeoJSON data:', data); // Log to check the data
                L.geoJSON(data, {
                    onEachFeature: function(feature, layer) {
                        // Additional interactions can be added here
                    },
                    pointToLayer: function(feature, latlng) {
                        console.log('Creating marker for:', feature.properties.name); // Log to check the feature
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

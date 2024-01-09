document.addEventListener('DOMContentLoaded', function() {
    var mymap = L.map('mapid').setView([0, 0], 2.7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mymap);

    function selectIcon(feature) {
        var className = 'pulsating-marker'; // Base class for all markers

        // Add color-specific class based on the feature's properties
        switch (feature.properties['marker-color']) {
            case '#FF0000': // red
                className += ' red';
                break;
            case '#00FF00': // green
                className += ' green';
                break;
            case '#7F00FF': // violet
                className += ' violet';
                break;
            case '#FFFF00': // yellow
                className += ' yellow';
                break;
            default:
                className += ''; // No additional class for default
        }

        // Return a divIcon with the specified classes
        return L.divIcon({
            className: className,
            html: '<div></div>', // This is needed to create the div inside the icon
            iconSize: [20, 20], // Adjust the size as needed
            iconAnchor: [10, 10] // Adjust the anchor point as needed
        });
    }

    // Function to create the Project Markers layer
    function addProjectMarkers() {
        fetch('https://aurashak.github.io/geojson/projectmarkers.geojson')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log the data to inspect its structure
                L.geoJSON(data, {
                    onEachFeature: function(feature, layer) {
                        // ...
                    },
                    pointToLayer: function(feature, latlng) {
                        return L.marker(latlng, { icon: selectIcon(feature) });
                    }
                }).addTo(mymap);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    }
    

    // Call this function to add the Project Markers layer immediately
    addProjectMarkers();
});

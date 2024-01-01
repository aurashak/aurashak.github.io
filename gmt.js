function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: 0, lng: 0},
        disableDefaultUI: true, // Disables the default UI controls
        styles: [
            {
                featureType: 'all',
                elementType: 'all',
                stylers: [{visibility: 'off'}] // Turn off visibility of all features
            }
        ]
    });

    // Then load your GeoJSON.
    map.data.loadGeoJson('https://aurashak.github.io/geojson/countries.geojson');

    // Optional: Define a style for your GeoJSON features
    map.data.setStyle({
        strokeColor: 'blue',
        strokeWeight: 1,
        fillColor: 'blue',
        fillOpacity: 0.1
    });
}

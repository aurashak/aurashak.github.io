function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: 0, lng: 0},
        disableDefaultUI: true, // Disables the default UI controls
        backgroundColor: 'white', // Sets background color beneath tiles to white
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

    // Define a style for your GeoJSON features
    map.data.setStyle({
        strokeColor: 'white',
        strokeWeight: 0.5,
        fillColor: 'black',
        fillOpacity: 0
    });
}

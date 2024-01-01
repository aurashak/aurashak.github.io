function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: 0, lng: 0},
        disableDefaultUI: true,
        backgroundColor: 'white',
        styles: [
            // Hide all default map features
            {
                featureType: 'all',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    // Load your GeoJSON.
    map.data.loadGeoJson('https://aurashak.github.io/geojson/countries.geojson');

    // Define a style for your GeoJSON features
    map.data.setStyle({
        strokeColor: 'white',
        strokeWeight: 0.5,
        fillColor: 'black',
        fillOpacity: 1
    });
}

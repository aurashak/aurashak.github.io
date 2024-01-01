function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: 0, lng: 0},
        disableDefaultUI: true,
        backgroundColor: 'white',
        styles: [
            // You can customize these styles to hide certain map features
            { elementType: 'geometry', stylers: [{color: '#f5f5f5'}] },
            { elementType: 'labels.icon', stylers: [{visibility: 'off'}] },
            { elementType: 'labels.text.fill', stylers: [{color: '#616161'}] },
            { elementType: 'labels.text.stroke', stylers: [{color: '#f5f5f5'}] }
            // Add more styles as needed
        ]
    });

    // Then load your GeoJSON.
    map.data.loadGeoJson('https://aurashak.github.io/geojson/countries.geojson');

    // Define a style for your GeoJSON features
    map.data.setStyle({
        strokeColor: 'white',
        strokeWeight: 0.5,
        fillColor: 'black',
        fillOpacity: 1
    });
}

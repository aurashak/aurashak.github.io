function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2, // Set a zoom level that shows a good portion of the globe
        center: {lat: 0, lng: 0} // Center the map at 0 degrees latitude and longitude
    });

    // Load a GeoJSON layer onto the map
    map.data.loadGeoJson('https://aurashak.github.io/geojson/countries.geojson');
}

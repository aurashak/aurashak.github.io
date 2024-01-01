function initMap() {
    var afghanistan = {lat: 34.5553, lng: 69.2075}; // Coordinates for a location in Afghanistan

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: afghanistan, 
        minZoom: 2,
        maxZoom: 7,
        disableDefaultUI: true,
        backgroundColor: 'white'
        // Other map options...
    });

    // Load your GeoJSON.
    map.data.loadGeoJson('https://aurashak.github.io/geojson/countries.geojson', {}, function (features) {
        var bounds = new google.maps.LatLngBounds();

        // Iterate over the features to calculate bounds
        features.forEach(function(feature) {
            processPoints(feature.getGeometry(), bounds.extend, bounds);
        });

        // Define the latitudinal bounds for the map
        var strictBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-85, -180), // Southwestern corner
            new google.maps.LatLng(85, 180)    // Northeastern corner
        );

        // Apply the restriction with strictBounds
        map.setOptions({
            restriction: {
                latLngBounds: strictBounds,
                strictBounds: true
            }
        });
    });

    // Define a style for your GeoJSON features
    map.data.setStyle({
        strokeColor: 'white',
        strokeWeight: 0.5,
        fillColor: 'black',
        fillOpacity: 1
    });

    // Update markers when the map is moved
    map.addListener('bounds_changed', function() {
        updateMarkers(map);
    });
}

function updateMarkers(map) {
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    // Update latitude markers
    var latitudes = [sw.lat(), ne.lat()];
    document.getElementById('lat-markers').textContent = latitudes.join('°, ') + '°';

    // Update longitude markers
    var longitudes = [sw.lng(), ne.lng()];
    document.getElementById('lng-markers').textContent = longitudes.join('°, ') + '°';
}

// Existing processPoints function...

function initMap() {
    var afghanistan = {lat: 34.5553, lng: 69.2075}; // Coordinates for a location in Afghanistan

    // Initialize the map with all base map features turned off
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: afghanistan, 
        minZoom: 2,
        maxZoom: 7,
        disableDefaultUI: true, // Disables the entire default UI
        zoomControl: true, // Enable zoom control
        backgroundColor: 'white',
        styles: [
            {
                featureType: 'all',
                stylers: [{ visibility: 'off' }] // Turn off visibility of all features
            }
        ]
    });

   // Load the GeoJSON file and adjust the bounds
map.data.loadGeoJson('https://aurashak.github.io/geojson/countries.geojson', {}, function (features) {
    var bounds = new google.maps.LatLngBounds();
    map.data.forEach(function(feature) {
        feature.getGeometry().forEachLatLng(function(latlng){
            bounds.extend(latlng);
        });
    });
    map.fitBounds(bounds); // Fit the map to the bounds of the GeoJSON
});

    // Style the GeoJSON features
    map.data.setStyle({
        strokeColor: 'white',
        strokeWeight: 0.5,
        fillColor: 'black',
        fillOpacity: 1
    });

    // Create the search box and link it to the UI element
    var input = document.getElementById('map-search');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards the current map's viewport
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }

        // For each place, get the icon, name, and location
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            if (place.geometry.viewport) {
                // Only geocodes have viewport
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

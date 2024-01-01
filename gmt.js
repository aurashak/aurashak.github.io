function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 1, // Set this to show the full extent of the Earth
        center: {lat: 0, lng: 0}, // Center the map at the equator and prime meridian
        minZoom: 1, // Minimum zoom level allowed
        maxZoom: 7, // Maximum zoom level allowed
        disableDefaultUI: true, // Disables the entire default UI
        zoomControl: true, // Enable zoom control
        backgroundColor: 'white',
        styles: [
            {
                featureType: 'all',
                stylers: [{ visibility: 'off' }] // Turn off visibility of all features
            }
        ],
        restriction: {
            latLngBounds: {
                north: 85,
                south: -85,
                east: 180,
                west: -180
            },
            strictBounds: true
        }
    });
    // Load the GeoJSON file
    map.data.loadGeoJson('https://aurashak.github.io/geojson/countries.geojson');

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

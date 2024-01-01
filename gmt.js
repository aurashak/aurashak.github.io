function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: {lat: 0, lng: 0},
        minZoom: 1,
        maxZoom: 7,
        disableDefaultUI: true,
        backgroundColor: 'white',
        styles: [{ featureType: 'all', stylers: [{ visibility: 'off' }] }],
        restriction: {
            latLngBounds: {
                north: 85,
                south: -85,
                east: 180,
                west: -180
            },
            strictBounds: true
        },
        zoomControl: true, // Enable zoom control
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT // Move zoom control to the top center
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

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: 0, lng: 0},
        minZoom: 2,
        maxZoom: 7,
        disableDefaultUI: true,
        backgroundColor: 'white',
        // Other map options...
    });

    // Load your GeoJSON.
    map.data.loadGeoJson('https://aurashak.github.io/geojson/countries.geojson', {}, function (features) {
        var bounds = new google.maps.LatLngBounds();

        // Iterate over the features to calculate bounds
        features.forEach(function(feature) {
            processPoints(feature.getGeometry(), bounds.extend, bounds);
        });

        map.fitBounds(bounds); // Fit the map to the bounds
        map.setCenter(bounds.getCenter()); // Set the center of the map

        // Apply the restriction
        map.setOptions({
            restriction: {
                latLngBounds: bounds,
                strictBounds: true,
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
}

// Function to process points in the geometry
function processPoints(geometry, callback, thisArg) {
    if (geometry instanceof google.maps.LatLng) {
        callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
        callback.call(thisArg, geometry.get());
    } else {
        geometry.getArray().forEach(function(g) {
            processPoints(g, callback, thisArg);
        });
    }
}

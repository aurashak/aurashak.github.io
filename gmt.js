function initMap() {
    var location = {lat: -34.397, lng: 150.644}; // Coordinates for the initial center of the map
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8, // Initial zoom level
        center: location
    });
}
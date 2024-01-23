mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

var map = new mapboxgl.Map({
    container: 'mtsmap',
    zoom: 16,
    pitch: 75,
    bearing: -260,
    minZoom: 16,
    maxZoom: 20,
    style: 'mapbox://styles/aurashk/clrpk291o007z01p5ad9261wx',
    center: [-73.957611, 40.822583],
});



// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());

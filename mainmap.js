mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/aurashk/clqoqcgqx00iv01p5ddg1fknw', // your custom Mapbox style
    center: [-74.0060, 40.7128], // starting position [lng, lat]
    zoom: 0 // starting zoom
});

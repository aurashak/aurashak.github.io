mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyYXNoayIsImEiOiJjbHBwd2dvZXYxNGQ0MnFwanZqeXV6OHV0In0.1ypymm-PTaV5y0Igl5fKzQ';

var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/aurashk/clqoqcgqx00iv01p5ddg1fknw', // your Mapbox style
    center: [40.785091, -73.968285], // starting position [lng, lat]
    zoom: 13, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

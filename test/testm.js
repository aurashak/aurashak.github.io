document.addEventListener('DOMContentLoaded', function() {
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    // Tile Layers
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' });
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', { attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020' });

// Declare an array to keep track of GeoJSON layers
var geoJSONLayers = [];

// Function to add GeoJSON layers
function addGeoJSONLayer(url, styleFunc, iconFunc) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var layer = L.geoJSON(data, {
                style: styleFunc,
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, { icon: iconFunc(feature) });
                },
                onEachFeature: onEachFeature
            }); 
            layer.addTo(mymap);
            geoJSONLayers.push(layer); // Add the layer to the array
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
}

// Function to remove all GeoJSON layers
function removeAllGeoJSONLayers() {
    geoJSONLayers.forEach(layer => {
        if (mymap.hasLayer(layer)) {
            mymap.removeLayer(layer);
        }
    });
}

// Layer Switching Functions
window.toggleOSMLayer = function() {
    removeAllGeoJSONLayers();
    if (mymap.hasLayer(satelliteLayer)) {
        mymap.removeLayer(satelliteLayer);
    }
    mymap.addLayer(osmLayer);
};

window.toggleSatelliteLayer = function() {
    removeAllGeoJSONLayers();
    if (mymap.hasLayer(osmLayer)) {
        mymap.removeLayer(osmLayer);
    }
    mymap.addLayer(satelliteLayer);
};

window.toggleGeoJSONLayer = function() {
    if (mymap.hasLayer(osmLayer)) {
        mymap.removeLayer(osmLayer);
    }
    if (mymap.hasLayer(satelliteLayer)) {
        mymap.removeLayer(satelliteLayer);
    }
    if (geoJSONLayers.some(layer => mymap.hasLayer(layer))) {
        removeAllGeoJSONLayers();
    } else {
        geoJSONLayers.forEach(layer => mymap.addLayer(layer));
    }
};

// Add GeoJSON layers
// Replace with your actual GeoJSON URLs and style/icon functions
addGeoJSONLayer('https://aurashak.github.io/geojson/countries.geojson', yourStyleFunction1, yourIconFunction1);
addGeoJSONLayer('https://aurashak.github.io/geojson/oceans.geojson', yourStyleFunction2, yourIconFunction2);
addGeoJSONLayer('https://aurashak.github.io/geojson/lakes.geojson', yourStyleFunction2, yourIconFunction2);
addGeoJSONLayer('https://aurashak.github.io/geojson/rivers.geojson', yourStyleFunction2, yourIconFunction2);
addGeoJSONLayer('https://aurashak.github.io/geojson/regions.geojson', yourStyleFunction2, yourIconFunction2);
addGeoJSONLayer('https://aurashak.github.io/geojson/projectmarkers.geojson', yourStyleFunction2, yourIconFunction2);

// ... add other GeoJSON layers as needed
});


    // Marker Icons
    var redIcon = L.icon({ 
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]});

    var greenIcon = L.icon({ 
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]});

    var violetIcon = L.icon({    
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]});

    var yellowIcon = L.icon({    
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]});

    var defaultIcon = L.icon({    
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]}); // Define a default icon

    // Style Functions
    function countriesStyle(feature) {
        return {
        color: feature.properties.stroke || 'grey',
        weight: feature.properties.weight || 0.25,
        fillColor: feature.properties.fill || 'black',
        fillOpacity: feature.properties.opacity || 1
    };}
    function oceanStyle(feature) {
        return {
        color: 'white', // outline color
        weight: 0.25,
        fillColor: 'white',
        fillOpacity: 1
    };}
    function lakesStyle(feature) {  
        return {
        color: 'white',
        weight: 0.25,
        fillColor: 'white',
        fillOpacity: 1
    };}
    function riversStyle(feature) { 
        return {
        color: 'white',
        weight: 0.25,
        fillColor: 'white',
        fillOpacity: 1
    };}
    function regionsStyle(feature) {
        return {
        color: 'red',
        weight: 0.01,
        fillColor: 'red',
        fillOpacity: 0.01
    };}

    // Feature Interaction
    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
        }
    }

// Adding GeoJSON Layers
function addGeoJSONLayer(url, styleFunc, iconFunc) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var layer = L.geoJSON(data, {
                style: styleFunc,
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, { icon: iconFunc(feature) });
                },
                onEachFeature: onEachFeature
            }).addTo(mymap);
            layer.bringToFront();
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
}


    // Icon Selector Function
    function selectIcon(feature) {
        switch (feature.properties['marker-color']) {
            case 'red': return redIcon;
            case 'green': return greenIcon;
            case 'violet': return violetIcon;
            case 'yellow': return yellowIcon;
            default: return defaultIcon;
        }
    }

    // Adding Layers
    addGeoJSONLayer('https://aurashak.github.io/geojson/countries.geojson', countriesStyle, selectIcon);
    addGeoJSONLayer('https://aurashak.github.io/geojson/oceans.geojson', oceanStyle, selectIcon);
    addGeoJSONLayer('https://aurashak.github.io/geojson/lakes.json', lakesStyle, selectIcon);
    addGeoJSONLayer('https://aurashak.github.io/geojson/rivers.geojson', riversStyle, selectIcon);
    addGeoJSONLayer('https://aurashak.github.io/geojson/regions.geojson', regionsStyle, selectIcon);
    
    addGeoJSONLayer('https://aurashak.github.io/geojson/projectmarkers.geojson', null, selectIcon); // No style function for markers

// Add a scale control to the map
L.control.scale({
    maxWidth: 100, // Width of the scale bar in pixels
    metric: true,  // Whether to show the metric scale (kilometers/meters)
    imperial: true, // Whether to show the imperial scale (miles/feet)
    updateWhenIdle: false // Whether to update the scale automatically
}).addTo(mymap);


    // Search Control
    var searchControl = new L.Control.geocoder({ placeholder: "Search for a place", geocoder: new L.Control.Geocoder.Nominatim() }).addTo(mymap);
    var searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            var query = document.getElementById('search-input').value;
            searchControl.geocoder.geocode(query, function(results) {
                if (results.length > 0) {
                    var bbox = results[0].bbox;
                    mymap.fitBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
                } else {
                    alert('Location not found');
                }
            });
        });
    }
});



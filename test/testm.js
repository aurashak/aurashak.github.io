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

    // Marker Icons (your icon URLs here)
    var redIcon = L.icon({ /* properties */ });
    // ... other icons

    // Style Functions (your style functions here)
    function countriesStyle(feature) { /* styling */ }
    // ... other style functions

    // Feature Interaction
    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
        }
    }

      // Function to add the project markers GeoJSON layer
      function addProjectMarkers(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    // Assume you have a style function and an icon function defined
                    // style: projectMarkerStyle,
                    // pointToLayer: function(feature, latlng) {
                    //     return L.marker(latlng, { icon: projectMarkerIcon(feature) });
                    // },
                    onEachFeature: onEachFeature // Assumes onEachFeature is defined
                }).addTo(mymap);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    }

    // Call this function once to add the project markers to the map
    addProjectMarkers('https://aurashak.github.io/geojson/projectmarkers.geojson');


    // Array to store GeoJSON layers
    var geoJSONLayers = [];

// Function to add GeoJSON layers and add them to the map
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
            layer.addTo(mymap); // Add the layer to the map immediately
            geoJSONLayers.push(layer); // Store the layer
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
}


    // Layer Switching Functions
    window.toggleOSMLayer = function() {
        removeAllLayers();
        mymap.addLayer(osmLayer);
    };

    window.toggleSatelliteLayer = function() {
        removeAllLayers();
        mymap.addLayer(satelliteLayer);
    };

    window.toggleGeoJSONLayer = function() {
        removeAllLayers();
        geoJSONLayers.forEach(layer => mymap.addLayer(layer));
    };

    function removeAllLayers() {
        mymap.eachLayer(function(layer) {
            mymap.removeLayer(layer);
        });
    }


     // Style Functions
     function countriesStyle(feature) {
        return {
        color: feature.properties.stroke || 'grey',
        weight: feature.properties.weight || 0.25,
        fillColor: feature.properties.fill || 'black',
        fillOpacity: feature.properties.opacity || 1
    };}
    function oceansStyle(feature) {
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
    function projectmarkersStyle(feature) {
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


// Add GeoJSON layers
// Replace with your actual GeoJSON URLs and style/icon functions
addGeoJSONLayer('https://aurashak.github.io/geojson/countries.geojson', countriesStyle, selectIcon);
addGeoJSONLayer('https://aurashak.github.io/geojson/oceans.geojson', oceansStyle, selectIcon);
addGeoJSONLayer('https://aurashak.github.io/geojson/lakes.geojson', lakesStyle, selectIcon);
addGeoJSONLayer('https://aurashak.github.io/geojson/rivers.geojson', riversStyle, selectIcon);
addGeoJSONLayer('https://aurashak.github.io/geojson/regions.geojson', regionsStyle, selectIcon);
addGeoJSONLayer('https://aurashak.github.io/geojson/projectmarkers.geojson', projectmarkersStyle, selectIcon);

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

    L.control.scale({ position: 'bottomleft' }).addTo(mymap);

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


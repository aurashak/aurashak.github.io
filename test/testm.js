// Event listener that runs when the DOM content is fully loaded.
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map on the "mapid" div with a given center and zoom level.
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    // Define the OpenStreetMap and Satellite tile layers.
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' });
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', { attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020' });

    // Object to keep track of the GeoJSON layers by name for easy access.
    var geoJSONLayers = {};

    // Add scale control to the map.
    L.control.scale({
        maxWidth: 100,
        metric: true,
        imperial: true,
        position: 'bottomleft'
    }).addTo(mymap);

    // Function to add GeoJSON layers to the map.
    function addGeoJSONLayer(url, styleFunc, iconFunc, name) {
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

                // Store the layer in the geoJSONLayers object with the provided name.
                geoJSONLayers[name] = layer;
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    }

    // Function to create and add the Project Markers layer to the map.
    function addProjectMarkers() {
        fetch('https://aurashak.github.io/geojson/projectmarkers.geojson')
            .then(response => response.json())
            .then(data => {
                var projectMarkersLayer = L.geoJSON(data, {
                    style: projectmarkersStyle,
                    onEachFeature: onEachFeature,
                    pointToLayer: function(feature, latlng) {
                        return L.marker(latlng, { icon: selectIcon(feature) });
                    }
                }).addTo(mymap);
                // Store the project markers layer in the geoJSONLayers object.
                geoJSONLayers['projectMarkers'] = projectMarkersLayer;
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    }

    // Immediately call the function to add the Project Markers layer.
    addProjectMarkers();

    // Add other GeoJSON layers to the map with their specific styles and icons.
    addGeoJSONLayer('https://aurashak.github.io/geojson/countries.geojson', countriesStyle, selectIcon, 'countries');
    addGeoJSONLayer('https://aurashak.github.io/geojson/oceans.geojson', oceansStyle, selectIcon, 'oceans');
    addGeoJSONLayer('https://aurashak.github.io/geojson/lakes.geojson', lakesStyle, selectIcon, 'lakes');
    addGeoJSONLayer('https://aurashak.github.io/geojson/rivers.geojson', riversStyle, selectIcon, 'rivers');
    addGeoJSONLayer('https://aurashak.github.io/geojson/regions.geojson', regionsStyle, selectIcon, 'regions');

    // Function to handle switching to the OSM layer.
    window.toggleOSMLayer = function() {
        removeAllLayers();
        mymap.addLayer(osmLayer);
        addProjectMarkers();
    };

    // Function to handle switching to the Satellite layer.
    window.toggleSatelliteLayer = function() {
        removeAllLayers();
        mymap.addLayer(satelliteLayer);
        addProjectMarkers();
    };

    // Function to handle switching to GeoJSON layers.
    window.toggleGeoJSONLayer = function() {
        removeAllLayers();
        // Re-add all the GeoJSON layers.
        for (var name in geoJSONLayers) {
            geoJSONLayers[name].addTo(mymap);
        }
    };

    // Function to remove all layers from the map.
    function removeAllLayers() {
        for (var name in geoJSONLayers) {
            mymap.removeLayer(geoJSONLayers[name]);
        }
    }

    // Define the style functions for each type of GeoJSON layer.
    function countriesStyle(feature) {
        // ...
    }
    function oceansStyle(feature) {
        // ...
    }
    // Define the rest of the style functions and any additional functionality.
});


    // Ensure project markers are still there
    addProjectMarkers();

// Helper function to remove all layers
function removeAllLayers() {
    mymap.eachLayer(function(layer) {
        mymap.removeLayer(layer);
    });
}

// Helper function to remove all layers except project markers
function removeAllLayersExceptProjectMarkers() {
    mymap.eachLayer(function(layer) {
        if (!isProjectMarkerLayer(layer)) {
            mymap.removeLayer(layer);
        }
    });
}

    // Helper function to check if the layer is the project markers layer
    function isProjectMarkerLayer(layer) {
        // Implement logic to determine if the layer is the project markers layer.
        // This may require setting a property on the layer when you create it,
        // or checking if the layer has certain features or properties.
    }


 // Function to remove all layers from the map
    function removeAllLayers() {
    mymap.eachLayer(function(layer) {
        mymap.removeLayer(layer);
    });
    }

// Style Functions for Geojson layers
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
        weight: 0.01,
        fillColor: 'white',
        fillOpacity: 1
    };}
    function lakesStyle(feature) {  
        return {
        color: 'white',
        weight: 0.01,
        fillColor: 'white',
        fillOpacity: 1
    };}
    function riversStyle(feature) { 
        return {
        color: 'white',
        weight: 0.01,
        fillColor: 'white',
        fillOpacity: 1
    };}
    function regionsStyle(feature) {
        return {
        color: 'red',
        weight: 0.01,
        fillColor: 'red',
        fillOpacity: 0.001
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


// Marker Icons
    var redIcon = L.icon({ 
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [16.67, 27.33], // 2/3 of the original size
    iconAnchor: [8, 27.33], // 2/3 of the original size
    popupAnchor: [1, -22.67], // Adjusted y-coordinate to 2/3 of the original size
    shadowSize: [27.33, 27.33] // 2/3 of the original size
});

    var greenIcon = L.icon({ 
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [16.67, 27.33], // 2/3 of the original size
    iconAnchor: [8, 27.33], // 2/3 of the original size
    popupAnchor: [1, -22.67], // Adjusted y-coordinate to 2/3 of the original size
    shadowSize: [27.33, 27.33] // 2/3 of the original size
});

    var violetIcon = L.icon({    
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [16.67, 27.33], // 2/3 of the original size
    iconAnchor: [8, 27.33], // 2/3 of the original size
    popupAnchor: [1, -22.67], // Adjusted y-coordinate to 2/3 of the original size
    shadowSize: [27.33, 27.33] // 2/3 of the original size
});

    var yellowIcon = L.icon({    
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [16.67, 27.33], // 2/3 of the original size
    iconAnchor: [8, 27.33], // 2/3 of the original size
    popupAnchor: [1, -22.67], // Adjusted y-coordinate to 2/3 of the original size
    shadowSize: [27.33, 27.33] // 2/3 of the original size
});

    var defaultIcon = L.icon({    
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [16.67, 27.33], // 2/3 of the original size
    iconAnchor: [8, 27.33], // 2/3 of the original size
    popupAnchor: [1, -22.67], // Adjusted y-coordinate to 2/3 of the original size
    shadowSize: [27.33, 27.33] // 2/3 of the original size
}); // Define a default icon

   



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

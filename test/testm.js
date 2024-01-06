// Event listener that runs when the DOM content is fully loaded.
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

// Function to create the Project Markers layer (don't change this)
    function addProjectMarkers() {
        fetch('https://aurashak.github.io/geojson/projectmarkers.geojson')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: projectmarkersStyle,
                    onEachFeature: onEachFeature,
                    // Assuming pointToLayer and selectIcon are defined
                    pointToLayer: function(feature, latlng) {
                        return L.marker(latlng, { icon: selectIcon(feature) });
                    }
                }).addTo(mymap);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
        }

// Call this function to add the Project Markers layer immediately
    addProjectMarkers();
    
// Array to store GeoJSON layers
    var geoJSONLayers = [];

// Function to load and add GeoJSON layers to the map
function addGeoJSONLayer(url, styleFunc, iconFunc) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var layer = L.geoJSON(data, {
                style: styleFunc,
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, { icon: iconFunc(feature) });
                },
                onEachFeature: function(feature, layer) {
                    layer.on({
                        mouseover: function(e) {
                            var layer = e.target;
                            var tooltipContent = '';
                            
                            if (feature.properties && feature.properties.name) {
                                tooltipContent += 'Name: ' + feature.properties.name + '<br>';
                            }

                            var latlng = layer.getBounds ? layer.getBounds().getCenter() : e.latlng;
                            tooltipContent += 'Lat: ' + latlng.lat.toFixed(5) + '<br>Lng: ' + latlng.lng.toFixed(5);

                            document.getElementById('info').innerHTML = tooltipContent;
                        },
                        mouseout: function(e) {
                            document.getElementById('info').innerHTML = 'Hover over a feature';
                        }
                    });
                }
            });
            layer.addTo(mymap);
            geoJSONLayers.push(layer); // Store the layer
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
}




// Add other GeoJSON layers
addGeoJSONLayer('https://aurashak.github.io/geojson/countries.geojson', countriesStyle, selectIcon);
addGeoJSONLayer('https://aurashak.github.io/geojson/oceans.geojson', oceansStyle, selectIcon);
addGeoJSONLayer('https://aurashak.github.io/geojson/lakes.json', lakesStyle, selectIcon);
addGeoJSONLayer('https://aurashak.github.io/geojson/rivers.geojson', riversStyle, selectIcon);
addGeoJSONLayer('https://aurashak.github.io/geojson/regions.geojson', regionsStyle, selectIcon);
addGeoJSONLayer('https://aurashak.github.io/geojson/projectmarkers.geojson', projectmarkersStyle, selectIcon);


// Add Scale Control
L.control.scale({
    maxWidth: 100,
    metric: true,
    imperial: true,
    position: 'bottomleft'
  }).addTo(mymap);
  

// Function to handle switching to OSM layer
window.toggleOSMLayer = function() {
    removeAllLayers(); // Remove all layers
    mymap.addLayer(osmLayer); // Add the OSM layer
    addProjectMarkers(); // Re-add the project markers
};

// Function to handle switching to Satellite layer
window.toggleSatelliteLayer = function() {
    removeAllLayers(); // Remove all layers
    mymap.addLayer(satelliteLayer); // Add the Satellite layer
    addProjectMarkers(); // Re-add the project markers
};

// Function to handle switching to GeoJSON layers
window.toggleGeoJSONLayer = function() {
    removeAllLayersExceptProjectMarkers(); // Remove all layers except project markers
    // Re-add all the GeoJSON layers
    geoJSONLayers.forEach(layer => mymap.addLayer(layer));
    addProjectMarkers(); // Ensure project markers are still there
};

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
        weight: 0,
        fillColor: 'red',
        fillOpacity: 0
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
    layer.on({
        mouseover: function(e) {
            var layer = e.target;

            // Update hover info content
            var hoverInfo = document.getElementById('hover-info');
            var content = '';

            // Check if the feature has a name property and add it to the content
            if (feature.properties && feature.properties.name) {
                content += 'Name: ' + feature.properties.name + '<br>';
            }

            // Add latitude and longitude
            if (layer.getLatLng) {
                var latlng = layer.getLatLng();
                content += 'Lat: ' + latlng.lat.toFixed(5) + '<br>Lng: ' + latlng.lng.toFixed(5);
            } else if (layer.getBounds) {
                var center = layer.getBounds().getCenter();
                content += 'Lat: ' + center.lat.toFixed(5) + '<br>Lng: ' + center.lng.toFixed(5);
            }

            // Set the content
            hoverInfo.innerHTML = content;
        },
        mouseout: function(e) {
            // Clear hover info when not hovering over a feature
            document.getElementById('hover-info').innerHTML = 'Hover over a feature';
        }
    });
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

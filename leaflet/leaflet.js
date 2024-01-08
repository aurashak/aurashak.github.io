// Event listener that runs when the DOM content is fully loaded.
document.addEventListener('DOMContentLoaded', function() {
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2.7);

// Tile Layers
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' });
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', { attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020' });


  

    mymap.on('mousemove', function(e) {
        updateHoverInfo(e.latlng);
    });
    


// This function updates the hover display with latitude, longitude, and optionally name and admin
function updateHoverInfo(latlng, nameAdminText = '') {
    // Get the current content that may include the name/admin information
    var currentInfo = document.getElementById('hover-info').innerHTML;
    var nameAdminInfo = nameAdminText || currentInfo.split('<br>').slice(1).join('<br>');

    // Update the info text with the new lat/lng and possibly existing name/admin info
    var infoText = 'Lat: ' + latlng.lat.toFixed(5) + ', Lng: ' + latlng.lng.toFixed(5);
    if (nameAdminInfo) {
        infoText += '<br>' + nameAdminInfo;
    }

    // Set the hover info display to the updated info text
    document.getElementById('hover-info').innerHTML = infoText;
}

// Event listener for mouse movement over the map
mymap.on('mousemove', function(e) {
    updateHoverInfo(e.latlng);
});

// Modify the onEachFeature function to handle feature-specific information
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: function(e) {
            var nameAdminText = '';
            // Check for 'ADMIN' property for countries or 'name' for other features
            if (feature.properties) {
                if (feature.properties.ADMIN) {
                    nameAdminText += feature.properties.ADMIN + '<br>';
                }
                if (feature.properties.name) {
                    nameAdminText += feature.properties.name;
                }
            }
            // Update the hover info with latlng and name/admin
            updateHoverInfo(e.latlng, nameAdminText);
        },
        mouseout: function(e) {
            // Optionally, you can reset the additional info when not hovering over a feature
            updateHoverInfo(e.latlng);
        }
    });
}


    // Function to handle feature interaction for GeoJSON layers
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: function(e) {
            var nameAdminText = '';
            // Check for 'ADMIN' property for countries or 'name' for other features
            if (feature.properties) {
                if (feature.properties.ADMIN) {
                    nameAdminText += feature.properties.ADMIN + '<br>';
                }
                if (feature.properties.name) {
                    nameAdminText += feature.properties.name;
                }
            }
            
            // Update the hover info with latlng and name/admin
            updateHoverInfo(e.latlng, nameAdminText);
        },
        mouseout: function(e) {
            // Reset the hover info when not hovering over a feature
            document.getElementById('hover-info').innerHTML = 'Hover over map';
        }
    });
}


// Array to store GeoJSON layers
    var geoJSONLayers = [];

// Function to create the Project Markers layer (don't change this)
function addProjectMarkers() {
    fetch('https://aurashak.github.io/geojson/projectmarkers.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: projectmarkersStyle,
                onEachFeature: onEachFeature,
                pointToLayer: function(feature, latlng) {
                    // This checks for the property to determine if the icon should be a pulsating red marker
                    if (feature.properties['marker-color'] === 'red') {
                        return L.marker(latlng, { icon: redMarker }); // Uses the redMarker divIcon
                    } else {
                        return L.marker(latlng, { icon: selectIcon(feature) }); // Fallback to standard icons
                    }
                }
            }).addTo(mymap);
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
}


// Call this function to add the Project Markers layer immediately
addProjectMarkers();

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
                    onEachFeature: onEachFeature
                });
                layer.addTo(mymap);
                geoJSONLayers.push(layer); // Store the layer
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    }

// Style Functions for Geojson layers
function countriesStyle(feature) {
    return {
    color: feature.properties.stroke || 'black',
    weight: feature.properties.weight || 0.45,
    fillColor: feature.properties.fill || 'white',
    fillOpacity: feature.properties.opacity || 1
};}
function oceansStyle(feature) {
    return {
    color: 'black', // outline color
    weight: 0,
    fillColor: 'black',
    fillOpacity: 1
};}
function lakesStyle(feature) {  
    return {
    color: 'white',
    weight: 0,
    fillColor: 'white',
    fillOpacity: 1
};}
function riversStyle(feature) { 
    return {
    color: 'white',
    weight: 0,
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
    weight: 0,
    fillColor: 'red',
    fillOpacity: 0
};}




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




// Marker Icons

var redMarker = L.divIcon({
    className: 'pulsating-marker red', // Refer to the CSS class
    iconSize: [10, 10] // Size of the icon
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

// Example content for markers
const markerContent = {
    'print': {
        text: 'This is Print',
        imgSrc: 'phttps://live.staticflickr.com/65535/52622371450_fdc259ddf8_h.jpg'
    },
    'sculpture': {
        text: 'This is Sculpture',
        imgSrc: 'https://live.staticflickr.com/65535/52622371450_fdc259ddf8_h.jpg'
    },
    // ... add other markers content
};

function getMarkerPopupContent(type) {
    const content = markerContent[type];
    return `
        <div class="popup-content">
            <img src="${content.imgSrc}" alt="${type}" />
            <p>${content.text}</p>
        </div>
    `;
}

function createMarker(latlng, type) {
    const marker = L.marker(latlng, { icon: selectIcon(type) });
    marker.bindPopup(getMarkerPopupContent(type));
    return marker;
}

marker.on('mouseover', function(e) {
    this.openPopup();
});
marker.on('mouseout', function(e) {
    this.closePopup();
});


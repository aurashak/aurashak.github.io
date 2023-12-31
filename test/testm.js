var mymap = L.map('mapid', {
    minZoom: 2,
    maxZoom: 18,
    maxBounds: [
      // south-west corner of the bounds
      [-90, -180],
      // north-east corner of the bounds
      [90, 180]
    ],
    maxBoundsViscosity: 1.0  // Makes the bounds fully solid, not allowing the user to pan outside
}).setView([0, 0], 2);


// Define the OpenStreetMap layer without adding it to the map
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

// Define the satellite layer without adding it to the map
var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
    attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
});

// Create a layer group for GeoJSON layers
var geojsonGroup = L.layerGroup().addTo(mymap);

// Function to add GeoJSON data to the map with mouseover event for country names
function addGeoJSONToGroup(url, style) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: style,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.ADMIN) { // Check if the property exists
                        layer.bindTooltip(feature.properties.ADMIN, { // Bind a tooltip with the country name
                            permanent: false, // The tooltip will not be permanent
                            direction: 'auto' // It will adjust its direction automatically
                        });
                        layer.on('mouseover', function () { // Event listener for mouseover
                            this.openTooltip(); // Open the tooltip on mouseover
                        });
                        layer.on('mouseout', function () { // Event listener for mouseout
                            this.closeTooltip(); // Close the tooltip on mouseout
                        });
                    }
                }
            }).addTo(geojsonGroup);
        });
}


// Add GeoJSON layers to the map
addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', {
    color: 'white',
    weight: 0.5,
    fillColor: 'black',
    fillOpacity: 1
});

// Function to toggle layers
function toggleLayer(layer) {
    if (mymap.hasLayer(layer)) {
        mymap.removeLayer(layer);
    } else {
        mymap.addLayer(layer);
    }
}

// Functions to toggle specific layers
function toggleOSMLayer() {
    toggleLayer(osmLayer);
}

function toggleSatelliteLayer() {
    toggleLayer(satelliteLayer);
}

function toggleGeoJSONLayer() {
    toggleLayer(geojsonGroup);
}

// Search control (optional)
var searchControl = new L.Control.geocoder({
    placeholder: "Search for a place",
    geocoder: new L.Control.Geocoder.Nominatim()
}).addTo(mymap);

// Search button event listener (optional)
document.getElementById('search-button').addEventListener('click', function() {
    var query = document.getElementById('search-input').value;
    searchControl.geocoder.geocode(query, function(results) {
        if (results.length > 0) {
            var bbox = results[0].bbox;
            mymap.fitBounds([
                [bbox[1], bbox[0]],
                [bbox[3], bbox[2]]
            ]);
        } else {
            alert('Location not found');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map with options
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    // Define the OpenStreetMap layer without adding it to the map
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    // Define the satellite layer without adding it to the map
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
        attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
    });

    // Create a layer group for GeoJSON layers and add it to the map
    var geojsonGroup = L.layerGroup().addTo(mymap);

 // Function to add GeoJSON data to the map with mouseover event for country names and coordinates
function addGeoJSONToGroup(url, style) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: style,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.ADMIN) {
                        // Initialize the tooltip with the country name and placeholders for coordinates
                        layer.bindTooltip('', {
                            permanent: false,
                            direction: 'auto',
                            className: 'country-tooltip',
                            sticky: true // Make the tooltip follow the cursor
                        });

                        // Update tooltip content on mouseover
                        layer.on('mouseover', function () {
                            this.openTooltip();
                        });

                        // Update tooltip content on mousemove
                        layer.on('mousemove', function (e) {
                            var lat = e.latlng.lat.toFixed(5);
                            var lng = e.latlng.lng.toFixed(5);
                            var tooltipContent = '<strong>' + feature.properties.ADMIN + '</strong><br>Lat: ' + lat + ', Lng: ' + lng;
                            this.setTooltipContent(tooltipContent);
                        });

                        // Clear tooltip content on mouseout
                        layer.on('mouseout', function () {
                            this.closeTooltip();
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

     addGeoJSONToGroup('https://aurashak.github.io/geojson/projectmarkers.geojson', {
        color: 'red',
        weight: 0.5,
        fillColor: 'black',
        fillOpacity: 1
    });

        addGeoJSONToGroup('https://aurashak.github.io/geojson/graticuletwo.geojson', {
            color: 'red',
            weight: 0.5,
            fillColor: 'black',
            fillOpacity: 1
        });

         addGeoJSONToGroup('https://aurashak.github.io/geojson/graticuletwo.geojson', {
            color: 'red',
            weight: 0.5,
            fillColor: 'black',
            fillOpacity: 1
        });

         addGeoJSONToGroup('https://aurashak.github.io/geojson/oceans.geojson', {
            color: 'red',
            weight: 0.5,
            fillColor: 'black',
            fillOpacity: 1
        });

         addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', {
            color: 'red',
            weight: 0.5,
            fillColor: 'black',
            fillOpacity: 1
        });

           addGeoJSONToGroup('https://aurashak.github.io/geojson/rivers.geojson', {
            color: 'red',
            weight: 0.5,
            fillColor: 'black',
            fillOpacity: 1
        });

           addGeoJSONToGroup('https://aurashak.github.io/geojson/lakes.geojson', {
            color: 'red',
            weight: 0.5,
            fillColor: 'black',
            fillOpacity: 1
        });

   // Add the dynamic scale bar to the map (proper placement)
    L.control.scale({
        imperial: false, // Set to true if you want miles and feet
        metric: true,    // Set to true if you want kilometers and meters
        updateWhenIdle: false // Updates the scale continuously as the map zooms
    }).addTo(mymap);
  
  
  
  
    // Function to switch layers
    function switchLayer(layer) {
        if (currentLayer) {
            mymap.removeLayer(currentLayer);
        }
        mymap.addLayer(layer);
        currentLayer = layer;
        // Ensure the GeoJSON layer with tooltips is always on top
        geojsonGroup.bringToFront();
    }

    // Define a variable to hold the current visible layer
    var currentLayer = geojsonGroup; // Set the initial layer to GeoJSON

    // Button functions to switch between layers
    window.toggleOSMLayer = function() { switchLayer(osmLayer); }
    window.toggleSatelliteLayer = function() { switchLayer(satelliteLayer); }
    window.toggleGeoJSONLayer = function() { switchLayer(geojsonGroup); }

    // Add the search control to the map
    var searchControl = new L.Control.geocoder({
        placeholder: "Search for a place",
        geocoder: new L.Control.Geocoder.Nominatim()
    }).addTo(mymap);

    // Event listener for the search button
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

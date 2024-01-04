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
                    // Check for different properties based on layer type
                    var tooltipContent = '';

                    if (feature.properties && feature.properties.ADMIN) {
                        tooltipContent = feature.properties.ADMIN; // For countries
                    } else if (feature.properties && feature.properties.name) {
                        tooltipContent = feature.properties.name; // For lakes, rivers, etc.
                    } // Add more conditions as needed

                    if (tooltipContent !== '') {
                        layer.bindTooltip('', {
                            permanent: false,
                            direction: 'auto',
                            className: 'geojson-tooltip',
                            sticky: true
                        });

                        layer.on('mouseover', function () {
                            this.openTooltip();
                        });

                        layer.on('mousemove', function (e) {
                            var lat = e.latlng.lat.toFixed(5);
                            var lng = e.latlng.lng.toFixed(5);
                            this.setTooltipContent('<strong>' + tooltipContent + '</strong><br>Lat: ' + lat + ', Lng: ' + lng);
                        });

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

         addGeoJSONToGroup('https://aurashak.github.io/geojson/oceans.geojson', {
            color: 'white',
            weight: 0.5,
            fillColor: 'white',
            fillOpacity: 1
        });

         addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', {
            color: 'white',
            weight: 0.5,
            fillColor: 'white',
            fillOpacity: 0.01
        });

           addGeoJSONToGroup('https://aurashak.github.io/geojson/rivers.geojson', {
            color: 'blue',
            weight: 0.5,
            fillColor: 'blue',
            fillOpacity: 1
        });

           addGeoJSONToGroup('https://aurashak.github.io/geojson/lakes.json', {
            color: 'blue',
            weight: 0.5,
            fillColor: 'blue',
            fillOpacity: 1
        });

        // After adding them to the map
if (lakesLayer) lakesLayer.bringToFront();
if (riversLayer) riversLayer.bringToFront();


   // Add the dynamic scale bar to the map (proper placement)
    L.control.scale({
        imperial: false, // Set to true if you want miles and feet
        metric: true,    // Set to true if you want kilometers and meters
        updateWhenIdle: false // Updates the scale continuously as the map zooms
    }).addTo(mymap);
  

    // Add graticule to the map (proper placement)
  L.graticule({
    interval: 20, // Interval in degrees for the graticule lines. Change as needed.
    style: {
        color: '#333',
        weight: 1
    }
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

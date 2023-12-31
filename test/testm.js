document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map with specific options
    var mymap = L.map('mapid', {
        minZoom: 2, 
        maxZoom: 18, 
        maxBounds: [[-90, -180], [90, 180]], 
        maxBoundsViscosity: 1.0 
    }).setView([0, 0], 2);

    // Define the OpenStreetMap layer without adding it to the map initially
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    // Define the satellite layer without adding it to the map initially
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
        attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
    });

    // Create a layer group for GeoJSON layers and add it to the map
    var geojsonGroup = L.layerGroup().addTo(mymap);

    // Function to add GeoJSON data to the map with mouseover event for country names
    function addGeoJSONToGroup(url, style) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: style,
                    onEachFeature: function (feature, layer) {
                        if (feature.properties && feature.properties.ADMIN) {
                            layer.bindTooltip(feature.properties.ADMIN, {
                                permanent: false,
                                direction: 'auto',
                                className: 'country-tooltip',
                                sticky: true // Make the tooltip follow the cursor
                            });
                            
                            layer.on('mouseover', function () {
                                this.openTooltip();
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

    // Function to toggle layers on and off
    function toggleLayer(layer) {
        if (mymap.hasLayer(layer)) {
            mymap.removeLayer(layer);
        } else {
            mymap.addLayer(layer);
        }
    }

    // Functions to toggle specific layers
    function toggleOSMLayer() { toggleLayer(osmLayer); }
    function toggleSatelliteLayer() { toggleLayer(satelliteLayer); }
    function toggleGeoJSONLayer() { toggleLayer(geojsonGroup); }

    // Add the search control to the map
    var searchControl = new L.Control.geocoder({
        placeholder: "Search for a place",
        geocoder: new L.Control.Geocoder.Nominatim()
    }).addTo(mymap);

    // Check if the search button exists before adding event listener
    if (document.getElementById('search-button')) {
        document.getElementById('search-button').addEventListener('click', function() {
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

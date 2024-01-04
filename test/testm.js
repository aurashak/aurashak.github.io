document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map with options
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
        attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
    });

    var geojsonGroup = L.layerGroup().addTo(mymap);

    function onEachFeature(feature, layer) {
        layer.on('mouseover', function(e) {
            var tooltipContent = '';
            if (feature.properties && feature.properties.ADMIN) {
                tooltipContent = 'Country: ' + feature.properties.ADMIN;
            } else if (feature.properties && feature.properties.name) {
                tooltipContent = feature.properties.name;
            }
            if (tooltipContent !== '') {
                this.bindTooltip(tooltipContent, {
                    permanent: false,
                    direction: 'auto',
                    className: 'geojson-tooltip',
                    sticky: true
                }).openTooltip();
            }
        });

        layer.on('mouseout', function(e) {
            this.closeTooltip();
        });
    }

    function addGeoJSONToGroup(url, style) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(geojsonGroup);
            });
    }

    addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', { color: 'white', weight: 0.5, fillColor: 'black', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/lakes.json', { color: 'blue', weight: 0.5, fillColor: 'blue', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/rivers.geojson', { color: 'blue', weight: 0.5, fillColor: 'blue', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/oceans.geojson', { color: 'lightblue', weight: 0.5, fillColor: 'lightblue', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', { color: 'green', weight: 0.5, fillColor: 'green', fillOpacity: 1 });

    L.graticule({
        interval: 20,
        style: {
            color: '#333',
            weight: 1
        }
    }).addTo(mymap);

    L.control.scale({
        imperial: false,
        metric: true,
        updateWhenIdle: false
    }).addTo(mymap);

    function switchLayer(layer) {
        if (mymap.hasLayer(geojsonGroup)) {
            mymap.removeLayer(geojsonGroup);
        }
        mymap.addLayer(layer);
    }

    window.toggleOSMLayer = function() { switchLayer(osmLayer); }
    window.toggleSatelliteLayer = function() { switchLayer(satelliteLayer); }
    window.toggleGeoJSONLayer = function() { switchLayer(geojsonGroup); }

    var searchControl = new L.Control.geocoder({
        placeholder: "Search for a place",
        geocoder: new L.Control.Geocoder.Nominatim()
    }).addTo(mymap);

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

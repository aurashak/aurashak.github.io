document.addEventListener('DOMContentLoaded', function() {
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' });
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', { attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020' });

    var geojsonGroup = L.layerGroup().addTo(mymap);

    var lakesLayer, riversLayer, regionsLayer;

    var redIcon = new L.Icon({
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var greenIcon = new L.Icon({
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var blackIcon = new L.Icon({
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-black.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var yellowIcon = new L.Icon({
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-yellow.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    function pointToLayer(feature, latlng) {
        var icon;
        switch (feature.properties['marker-color']) {
            case 'red':
                icon = redIcon;
                break;
            case 'green':
                icon = greenIcon;
                break;
            case 'black':
                icon = blackIcon;
                break;
            case 'yellow':
                icon = yellowIcon;
                break;
            default:
                icon = defaultIcon; // A default icon in case no specific color is provided
        }
        return L.marker(latlng, { icon: icon });
    }
    
    function addGeoJSONToGroup(url, assignLayer) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                var layer = L.geoJSON(data, {
                    pointToLayer: pointToLayer, // Make sure this is correctly referenced
                    onEachFeature: function(feature, layer) {
                        // Only apply styles if the feature is not a point (i.e., Polygon or LineString)
                        if (feature.geometry.type !== "Point") {
                            layer.setStyle({
                                color: 'grey', // or feature.properties.stroke, etc.
                                weight: 0.5,
                                fillColor: 'black',
                                fillOpacity: 1
                            });
                        }
                        var tooltipContent = feature.properties.name || '';
                        layer.bindTooltip(tooltipContent, {
                            permanent: false,
                            direction: 'auto'
                        });
                    }
                }).addTo(geojsonGroup);
                if (assignLayer) assignLayer(layer);
            });
    }
    

    function bringToFront() {
        if (lakesLayer) lakesLayer.bringToFront();
        if (riversLayer) riversLayer.bringToFront();
        if (regionsLayer) regionsLayer.bringToFront();
    }

    addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', { color: 'grey', weight: 0.5, fillColor: 'black', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/lakes.json', { color: 'white', weight: 0.1, fillColor: 'white', fillOpacity: 1 }, (layer) => { lakesLayer = layer; bringToFront(); });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/rivers.geojson', { color: 'white', weight: 0.25, fillColor: 'white', fillOpacity: 1 }, (layer) => { riversLayer = layer; bringToFront(); });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/oceans.geojson', { color: 'white', weight: 0.5, fillColor: 'white', fillOpacity: 1 });
    addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', { color: 'green', weight: 0.1, fillColor: 'green', fillOpacity: 0.01, opacity: 0.01 }, (layer) => { regionsLayer = layer; bringToFront(); });    
    addGeoJSONToGroup('https://aurashak.github.io/geojson/projectmarkers.geojson', { color: 'red', weight: 0.5, fillColor: 'red', fillOpacity: 1 });

    L.control.scale({ imperial: false, metric: true, updateWhenIdle: false }).addTo(mymap);

    function switchLayer(layer) {
        if (mymap.hasLayer(mymap.currentLayer)) {
            mymap.removeLayer(mymap.currentLayer);
        }
        mymap.addLayer(layer);
        mymap.currentLayer = layer;
        bringToFront();
    }

    mymap.currentLayer = geojsonGroup;
    switchLayer(geojsonGroup);  // Make GeoJSON group the default visible layer

    window.toggleOSMLayer = function() { switchLayer(osmLayer); }
    window.toggleSatelliteLayer = function() { switchLayer(satelliteLayer); }
    window.toggleGeoJSONLayer = function() { switchLayer(geojsonGroup); }

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

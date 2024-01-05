document.addEventListener('DOMContentLoaded', function() {
    var mymap = L.map('mapid', {
        minZoom: 2,
        maxZoom: 18,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([0, 0], 2);

    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' });
    var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', { attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020' });

   

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

    var geojsonGroup = L.layerGroup().addTo(mymap);
    var lakesLayer, riversLayer, regionsLayer;


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

    function addGeoJSONLayer(url, styleFunc, icon) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: styleFunc,
                    pointToLayer: function(feature, latlng) {
                        return L.marker(latlng, { icon: icon });
                    }
                }).addTo(mymap);
            });
    }

    function countriesStyle(feature) {
        return {
            color: feature.properties.stroke || 'grey',
            weight: feature.properties.weight || 0.5,
            fillColor: feature.properties.fill || 'black',
            fillOpacity: feature.properties.opacity || 1
        };
    }

    function oceanStyle(feature) {
        return {
            color: 'blue', // outline color
            weight: 1,
            fillColor: 'white',
            fillOpacity: 0.5
        };
    }
    
    function lakesStyle(feature) {
        return {
            color: 'blue',
            weight: 0.5,
            fillColor: 'white',
            fillOpacity: 1
        };
    }
    
    function riversStyle(feature) {
        return {
            color: 'blue',
            weight: 0.25,
            fillColor: 'white',
            fillOpacity: 1
        };
    }

    function regionsStyle(feature) {
        return {
            color: 'red',
            weight: 0.25,
            fillColor: 'red',
            fillOpacity: 1
        };
    }

    function projectmarkersStyle(feature) {
        return {
            color: 'red',
            weight: 0.25,
            fillColor: 'red',
            fillOpacity: 1
        };
    }



    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
        }
    }

    

      
      // Repeat for other layers, ensuring that the getStyle function is tailored to each layer's needs.

        addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', countriesStyle);
        addGeoJSONToGroup('https://aurashak.github.io/geojson/oceans.geojson', oceanStyle, (layer) => { /*...*/ });
        addGeoJSONToGroup('https://aurashak.github.io/geojson/lakes.json', lakesStyle, (layer) => { /*...*/ });
        addGeoJSONToGroup('https://aurashak.github.io/geojson/rivers.geojson', riversStyle, (layer) => { /*...*/ });
        addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', regionsStyle, (layer) => { /*...*/ });
        addGeoJSONToGroup('https://aurashak.github.io/geojson/regions.geojson', projectmarkersStyle, (layer) => { /*...*/ });



      
    function bringToFront() {
        if (lakesLayer) lakesLayer.bringToFront();
        if (riversLayer) riversLayer.bringToFront();
        if (regionsLayer) regionsLayer.bringToFront();
    }

    
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

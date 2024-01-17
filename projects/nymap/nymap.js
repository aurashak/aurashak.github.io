document.addEventListener("DOMContentLoaded", function () {
    // Define the bounds of the New York City metropolitan region
    var southWest = L.latLng(40.377399, -74.259090),
        northEast = L.latLng(41.134986, -73.700180),
        bounds = L.latLngBounds(southWest, northEast);

    // Initialize the map with a specific location and zoom level
    var map = L.map('map', {
        center: [40.7128, -74.0060], // New York City coordinates
        zoom: 10, // Initial zoom level
        minZoom: 10, // Minimum zoom level to restrict zooming out
        maxBounds: bounds, // Restrict panning to the New York City metropolitan region
        maxBoundsViscosity: 1.0 // Make the map bounce back when dragged outside the bounds
    });

 // Define the base layers (Surface Temperature, Powerplants, Nyccounties, Waste, Floodplain, and Outfalls)
 var surfaceTemperatureLayer = L.tileLayer('https://wvs.earthdata.nasa.gov/wms/wms?service=WMS&request=GetMap&layers=MODIS_Terra_Land_Surface_Temperature&width=512&height=512&bbox={bbox-epsg-3857}&format=image/png&transparent=true&time=2023-01-01T00:00:00Z', {
    attribution: 'Surface Temperature data © NASA Worldview',
    minZoom: 10,
    maxZoom: 12,
}).addTo(map);

    var powerplantsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycpowerplants.geojson', {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 3,
                fillColor: 'red',
                color: 'black',
                weight: 1,
                opacity: 0.5,
                fillOpacity: 0.5
            });
        }
    });

    var nyccountiesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nyccounties.geojson', {
        style: function (feature) {
            return {
                fillColor: 'gray',
                color: 'black',
                weight: 0.25,
                opacity: 0.4,
                fillOpacity: 0.1
            };
        }
    });

    var nycwasteLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycwaste.geojson', {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 3,
                fillColor: 'green',
                color: 'black',
                weight: 1,
                opacity: 0.5,
                fillOpacity: 0.5
            });
        }
    });

    var floodplainLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson', {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                fillColor: 'blue',
                color: 'black',
                weight: 1,
                opacity: 0.5,
                fillOpacity: 0.6
            });
        }
    });

    var citywideoutfallsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/citywideoutfalls.geojson', {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 3,
                fillColor: 'brown',
                color: 'black',
                weight: 0.1,
                opacity: 1,
                fillOpacity: 0.5
            });
        }
    });

    // Create a scale control and add it to the map
    L.control.scale().addTo(map);

    // Create a layer group for base layers
    var baseLayers = {
        "Surface Temperature": surfaceTemperatureLayer,        
        "Powerplants": powerplantsLayer,
        "Nyccounties": nyccountiesLayer,
        "Waste": nycwasteLayer,
        "Floodplain": floodplainLayer,
        "Outfalls": citywideoutfallsLayer
    };

// Add the Surface Temperature layer by default
surfaceTemperatureLayer.addTo(map);

    // Function to toggle base layers
    function toggleBaseLayer(layerName) {
        if (map.hasLayer(baseLayers[layerName])) {
            map.removeLayer(baseLayers[layerName]);
        } else {
            map.addLayer(baseLayers[layerName]);
        }
    }

    // Load and add the NYC power plants GeoJSON layer

    document.getElementById('toggle-powerplants').addEventListener('click', function () {
        toggleLayer(powerplantsLayer);
    });

    document.getElementById('toggle-nyccounties').addEventListener('click', function () {
        toggleLayer(nyccountiesLayer);
    });

    document.getElementById('toggle-nycwaste').addEventListener('click', function () {
        toggleLayer(nycwasteLayer);
    });

    document.getElementById('toggle-floodplain').addEventListener('click', function () {
        toggleLayer(floodplainLayer);
    });

    document.getElementById('toggle-citywideoutfalls').addEventListener('click', function () {
        toggleLayer(citywideoutfallsLayer);
    });

    // Create a control panel for layer toggles
    var layerControl = L.control.layers(baseLayers, null, { position: 'topright' });

    // Add the layer control to the map
    layerControl.addTo(map);

    // Function to toggle GeoJSON layers
    function toggleLayer(layer) {
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        } else {
            map.addLayer(layer);
        }
    }

  // Add a toggle for Surface Temperature
  var surfaceTemperatureToggle = L.control({
    position: 'topright'
});


surfaceTemperatureToggle.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<h4>Surface Temperature</h4>';
    div.innerHTML += '<label class="switch"><input type="checkbox" id="toggle-surface-temperature"><span class="slider round"></span></label>';
    return div;
};

surfaceTemperatureToggle.addTo(map);

document.getElementById('toggle-surface-temperature').addEventListener('change', function () {
    toggleLayer(surfaceTemperatureLayer);
});


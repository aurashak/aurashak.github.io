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


    // Define the base layers (OpenStreetMap and Satellite)
    var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var satellite = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg', {
        attribution: '© <a href="https://s2maps.eu/">Sentinel-2 cloudless by EOX IT Services GmbH</a>'
    });

    // Create a layer group for base layers
    var baseLayers = {
        "OpenStreetMap": openStreetMap,
        "Satellite": satellite
    };

    // Add the base layers to the map
    openStreetMap.addTo(map); // By default, start with OpenStreetMap as the visible layer

    // Function to toggle base layers
    function toggleBaseLayer(layerName) {
        if (map.hasLayer(baseLayers[layerName])) {
            map.removeLayer(baseLayers[layerName]);
        } else {
            map.addLayer(baseLayers[layerName]);
        }
    }

        // Load and add the 100 year floodplain GeoJSON layer
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
        }).addTo(map);

    // Load and add the GeoJSON layer with updated style
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
    }).addTo(map);

// Load and add the counties GeoJSON layer with fill and line styling
var nyccountiesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nyccounties.geojson', {
    style: function (feature) {
        return {
            fillColor: 'gray',
            color: 'black',
            weight: 0.25,
            opacity: 0.4,
            fillOpacity: 0.5
        };
    }
}).addTo(map);

    

    
    // Load and add the NYC power plants GeoJSON layer
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
    }).addTo(map);


        // Load and add the NYC power plants GeoJSON layer
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
        }).addTo(map);


    document.getElementById('toggle-floodplain').addEventListener('click', function() {
        if (map.hasLayer(floodplainLayer)) {
            map.removeLayer(floodplainLayer);
        } else {
            map.addLayer(floodplainLayer);
        }
    });
    
    document.getElementById('toggle-powerplants').addEventListener('click', function() {
        if (map.hasLayer(powerplantsLayer)) {
            map.removeLayer(powerplantsLayer);
        } else {
            map.addLayer(powerplantsLayer);
        }
    });

    document.getElementById('toggle-citywideoutfalls').addEventListener('click', function() {
        if (map.hasLayer(citywideoutfallsLayer)) {
            map.removeLayer(citywideoutfallsLayer);
        } else {
            map.addLayer(citywideoutfallsLayer);
        }
    });

    document.getElementById('toggle-nycwaste').addEventListener('click', function() {
        if (map.hasLayer(nycwasteLayer)) {
            map.removeLayer(nycwasteLayer);
        } else {
            map.addLayer(nycwasteLayer);
        }
    });
    

    // Create a control panel for layer toggles
    var layerControl = L.control.layers(baseLayers, null, { position: 'topright' });

    layerControl.addTo(map); // Add the layer control to the map
});




// Replace 'YOUR_API_KEY' with your actual API key
const apiKey = '6e5734e8-2042-4b6e-9fb9-e723be01b908';

// Define a function to fetch air quality data
function getAirQualityData(latitude, longitude) {
  const apiUrl = `https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Extract relevant air quality data from 'data' here
      const airQuality = data.data;
      // Display the air quality data on the map (e.g., in a popup)
      const popupContent = `
        <h3>${airQuality.city}</h3>
        <p>AQI: ${airQuality.current.pollution.aqius}</p>
        <p>PM2.5: ${airQuality.current.pollution.pm25} µg/m³</p>
        <!-- Add more data as needed -->
      `;
      L.marker([latitude, longitude]).bindPopup(popupContent).addTo(map);
    })
    .catch((error) => {
      console.error('Error fetching air quality data:', error);
    });
}

// Example usage: Call getAirQualityData with specific coordinates
getAirQualityData(40.7128, -74.0060); // New York City coordinates


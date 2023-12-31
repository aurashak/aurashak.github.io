var mymap = L.map('mapid', {
    minZoom: 2,
    maxZoom: 12,
  }).setView([0, 0], 3);
  
  // Define tile layers
  // OSM layer is not added by default now
  var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
  });
  
  var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
      attribution: '© EOX IT Services GmbH - Source: contains modified Copernicus Sentinel data 2020'
  });
  
  // GeoJSON group is added to the map initially
  var geojsonGroup = L.layerGroup().addTo(mymap);
  
  // Function to add GeoJSON data to the group
  function addGeoJSONToGroup(url, style) {
      return fetch(url)
          .then(function(response) {
              return response.json();
          })
          .then(function(data) {
              L.geoJSON(data, { style: style }).addTo(geojsonGroup);
          });
  }
  
  // Add countries, lakes, and rivers layers to the group
  addGeoJSONToGroup('https://aurashak.github.io/geojson/countries.geojson', {
      color: 'white',
      weight: 0.5,
      fillColor: 'black',
      fillOpacity: 1
  }).then(function() {
      return addGeoJSONToGroup('https://aurashak.github.io/geojson/ne_10m_lakes.json', {
          color: 'white',
          weight: 0,
          fillColor: 'white',
          fillOpacity: 1
      });
  }).then(function() {
      return addGeoJSONToGroup('https://aurashak.github.io/geojson/earth-rivers.geo.json', {
          color: 'white',
          weight: 0.03,
          fillOpacity: 1
      });
  }).catch(function(error) {
      console.error('Error loading GeoJSON data:', error);
  });
  
  // Toggle layer functions
  function toggleLayer(layer, otherLayers) {
      if (mymap.hasLayer(layer)) {
          mymap.removeLayer(layer);
      } else {
          mymap.addLayer(layer);
          otherLayers.forEach(function(l) {
              mymap.removeLayer(l);
          });
      }
  }
  
  function toggleOSMLayer() {
      toggleLayer(osmLayer, [satelliteLayer, geojsonGroup]);
  }
  
  function toggleSatelliteLayer() {
      toggleLayer(satelliteLayer, [osmLayer, geojsonGroup]);
  }
  
  function toggleGeoJSONLayer() {
      toggleLayer(geojsonGroup, [osmLayer, satelliteLayer]);
  }
  
  // Add the search control to the map
  var searchControl = new L.Control.geocoder({
      placeholder: "Search for a place",
      geocoder: new L.Control.Geocoder.Nominatim()
  }).addTo(mymap);
  
  // Event listener for the search button
  document.getElementById('search-button').addEventListener('click', function() {
      var query = document.getElementById('search-input').value;
      L.Control.Geocoder.nominatim().geocode(query, function(results) {
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
  
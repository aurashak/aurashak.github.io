// Fetch GeoJSON data and add filtered features to the map as a layer
fetch('https://aurashak.github.io/projects/cannamap/maps/statesandprovinces.geojson')
    .then(response => response.json())
    .then(data => {
        console.log('Original GeoJSON data:', data); // Log original GeoJSON data

        // Filter GeoJSON features to only include those labeled "United States of America" in the "geounit" category
        var filteredData = data.features.filter(feature => feature.properties.geoununit === "United States of America");
        console.log('Filtered GeoJSON data:', filteredData); // Log filtered GeoJSON data

        // Create a new GeoJSON object with the filtered features
        var filteredGeoJSON = {
            type: 'FeatureCollection',
            features: filteredData
        };
        console.log('Filtered GeoJSON:', filteredGeoJSON); // Log filtered GeoJSON object

        // Add filtered GeoJSON layer to the map with custom styles and labels
        L.geoJSON(filteredGeoJSON, {
            style: function(feature) {
                return {
                    fillColor: 'white',    // Fill color (change to your desired color)
                    fillOpacity: 0.9,       // Fill opacity
                    color: 'black',          // Border color (change to your desired color)
                    weight: .5               // Border weight
                };
            },
            onEachFeature: function(feature, layer) {
                // Check if the feature has labels in the "postal" category
                if (feature.properties.postal) {
                    // Bind the label as a popup to the layer
                    layer.bindPopup(feature.properties.postal);
                }
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching GeoJSON data:', error);
    });

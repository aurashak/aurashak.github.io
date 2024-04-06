import json

# Read GeoJSON file
with open('maps/statesandprovinces.geojson', 'r') as f:
    geojson_data = json.load(f)

# Define the base JavaScript code template
base_js_template = """
// Initialize the map
var map = L.map('cannamap', {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false
});

// Add base map tiles with opacity set
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.5 // Set opacity to 50%
}).addTo(map);

"""

# Iterate over features in GeoJSON data
for feature in geojson_data['features']:
    # Extract country name and center coordinates
    country_name = feature['properties']['geonunit']
    latitude = feature['properties']['latitude']
    longitude = feature['properties']['longitude']

    # Generate JavaScript code for each country
    js_code = f"""
// Fetch GeoJSON data for {country_name} and add to the map
fetch('https://aurashak.github.io/projects/cannamap/maps/statesandprovinces.geojson')
    .then(response => response.json())
    .then(data => {{
        // Filter GeoJSON features to only include {country_name}
        var filteredData = data.features.filter(feature => feature.properties.geonunit === "{country_name}");

        // Create a new GeoJSON object with the filtered features
        var filteredGeoJSON = {{
            type: 'FeatureCollection',
            features: filteredData
        }};

        // Add filtered GeoJSON layer to the map with custom styles and tooltips
        L.geoJSON(filteredGeoJSON, {{
            style: function(feature) {{
                return {{
                    fillColor: 'white',    // Fill color (change to your desired color)
                    fillOpacity: 0.9,       // Fill opacity
                    color: 'black',          // Border color (change to your desired color)
                    weight: .5               // Border weight
                }};
            }},
            onEachFeature: function(feature, layer) {{
                var tooltipText = feature.properties.postal; // Assuming the category property holds the label information
                layer.bindTooltip(tooltipText, {{ permanent: false, direction: 'center' }});
            }}
        }}).addTo(map);
    }})
    .catch(error => {{
        console.error('Error fetching GeoJSON data:', error);
    }});
"""

    # Write JavaScript code to file
    with open(f'{country_name.replace(" ", "_").lower()}_cannamapstates.js', 'w') as js_file:
        js_file.write(base_js_template + js_code)

    # Generate HTML code for each country
    html_code = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{country_name} Canna Map</title>

    <!-- Include Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

    <!-- Include custom CSS -->
    <link rel="stylesheet" href="https://aurashak.github.io/main.css">
</head>
<body>

<div class="aboutcontainer">
    <div class="maptitle">{country_name} Canna Map</div>
    <div id="cannamap"></div>
</div>

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script src="{country_name.replace(" ", "_").lower()}_cannamapstates.js"></script>

</body>
</html>
"""

    # Write HTML code to file
    with open(f'{country_name.replace(" ", "_").lower()}_cannamapstates.html', 'w') as html_file:
        html_file.write(html_code)

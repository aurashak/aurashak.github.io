import geopandas as gpd
import folium
from branca.colormap import linear

# Load emissions data from CSV
emissions_df = gpd.read_file('GHG_totals_by_country-Table 1.csv', skiprows=1)

# Load GeoJSON file for the world map
world_map = gpd.read_file('countries.geojson')

# Merge emissions data with GeoJSON features
merged_df = world_map.merge(emissions_df, how='left', left_on='name', right_on='Country')

# Convert merged GeoDataFrame to GeoJSON
mergedData = merged_df.__geo_interface__

# Function to determine color based on emission value
def getColor(emission):
    # Define color stops
    colors = ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
    values = [0, 10, 20, 50, 100, 200, 500, 1000]

    # Iterate through values and return corresponding color
    for i in range(len(values)):
        if emission < values[i]:
            return colors[i]
    return colors[-1]  # Default to the last color if value exceeds all stops

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)

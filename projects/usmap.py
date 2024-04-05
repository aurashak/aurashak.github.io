import folium

def create_us_map():
    # Create a map centered on the United States
    uscannamap = folium.Map(location=[37.0902, -95.7129], zoom_start=4)

    # Add a marker for each state in the United States
    # You can customize this to add additional features such as tooltips, popups, etc.
    folium.Marker([39.8333, -98.5855], tooltip='Kansas').add_to(uscannamap)
    folium.Marker([37.7749, -122.4194], tooltip='California').add_to(uscannamap)
    # Add more markers for other states...

    # Save the map to an HTML file
    uscannamap.save('uscannamap.html')

if __name__ == "__main__":
    create_us_map()

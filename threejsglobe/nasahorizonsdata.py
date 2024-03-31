import requests

def fetch_horizons_data(target_body):
    url = 'https://ssd.jpl.nasa.gov/horizons_batch.cgi'
    params = {
        'batch': '1',
        'COMMAND': f'"{target_body}"',
        'MAKE_EPHEM': '"YES"',
        'TABLE_TYPE': '"VECTORS"',
        'OUT_UNITS': '"KM-D"',
        'REF_PLANE': '"ECLIPTIC"',
        'START_TIME': '"2024-04-01"',
        'STOP_TIME': '"2024-04-02"',
        'STEP_SIZE': '"1d"',
        'CSV_FORMAT': '"YES"'
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.text
    else:
        print("Failed to fetch data from NASA Horizons API")
        return None

# Example usage
earth_data = fetch_horizons_data('399')
moon_data = fetch_horizons_data('301')

# Save data to files
with open('earth_data.csv', 'w') as f:
    f.write(earth_data)

with open('moon_data.csv', 'w') as f:
    f.write(moon_data)

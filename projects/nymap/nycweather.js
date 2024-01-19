
const apiKey = ' 	QHQrYMKYdGlBqiGiogmYgbSHiAQyVbjo';

// Define the NOAA API endpoints for the data you need
const currentConditionsEndpoint = 'https://www.ncdc.noaa.gov/cdo-web/webservices/v2/currentconditions';
const forecastEndpoint = 'https://www.ncdc.noaa.gov/cdo-web/webservices/v2/forecast';

// Function to fetch current weather conditions
function fetchCurrentWeather() {
  const apiUrl = `${currentConditionsEndpoint}?stationId=YOUR_STATION_ID_HERE`;
  fetch(apiUrl, {
    headers: {
      'token': apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Process and display current weather data
      const currentWeather = data.results[0]; // Assuming you only need the first result
      console.log('Current Weather:', currentWeather);
      const temperature = currentWeather.temperature;
      const humidity = currentWeather.humidity;
      const sunrise = currentWeather.sunrise;
      const sunset = currentWeather.sunset;
      // Display this information in your UI
    })
    .catch((error) => {
      console.error('Error fetching current weather:', error);
    });
}

// Function to fetch emergency broadcast information
function fetchEmergencyBroadcast() {
  const apiUrl = `${forecastEndpoint}?point=YOUR_LATITUDE,YOUR_LONGITUDE_HERE&format=json`;
  fetch(apiUrl, {
    headers: {
      'token': apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Process and display emergency broadcast information
      const forecastData = data.properties.periods;
      const emergencyBroadcast = forecastData.filter((item) => item.name === 'EMERGENCY BROADCAST');
      if (emergencyBroadcast.length > 0) {
        console.log('Emergency Broadcast:', emergencyBroadcast[0].detailedForecast);
        // Display this information in your UI
      } else {
        console.log('No emergency broadcast information available.');
      }
    })
    .catch((error) => {
      console.error('Error fetching emergency broadcast:', error);
    });
}

// Call the functions to fetch data
fetchCurrentWeather();
fetchEmergencyBroadcast();

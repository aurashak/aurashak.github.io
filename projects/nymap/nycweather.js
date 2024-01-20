// Replace 'YOUR_NOAA_API_KEY' with your actual NOAA API key
const noaaApiKey = 'QHQrYMKYdGlBqiGiogmYgbSHiAQyVbjo';

// NOAA API endpoints
const currentConditionsEndpoint = 'https://www.ncdc.noaa.gov/cdo-web/webservices/v2/currentconditions';
const forecastEndpoint = 'https://www.ncdc.noaa.gov/cdo-web/webservices/v2/forecast';

// Function to fetch current weather conditions
function fetchCurrentWeather() {
  const apiUrl = `${currentConditionsEndpoint}?stationId=KWO35`;
  fetch(apiUrl, {
    headers: {
      'token': noaaApiKey,
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
      // Update the content of the HTML elements with the fetched data
      document.getElementById('temperature').textContent = temperature;
      document.getElementById('humidity').textContent = humidity;
      document.getElementById('sunrise').textContent = sunrise;
      document.getElementById('sunset').textContent = sunset;
    })
    .catch((error) => {
      console.error('Error fetching current weather:', error);
    });
}

// Function to fetch emergency broadcast information
function fetchEmergencyBroadcast() {
  const apiUrl = `${forecastEndpoint}?point=40.6782° N, 73.9442° W&format=json`;
  fetch(apiUrl, {
    headers: {
      'token': noaaApiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Process and display emergency broadcast information
      const forecastData = data.properties.periods;
      const emergencyBroadcast = forecastData.find((item) => item.name === 'EMERGENCY BROADCAST');
      if (emergencyBroadcast) {
        console.log('Emergency Broadcast:', emergencyBroadcast.detailedForecast);
        // Update the content of the HTML element with the fetched emergency broadcast information
        document.getElementById('emergency-broadcast').textContent = emergencyBroadcast.detailedForecast;
      } else {
        console.log('No emergency broadcast information available.');
        // Set a message in case of no emergency broadcast information
        document.getElementById('emergency-broadcast').textContent = 'No emergency broadcast information available.';
      }
    })
    .catch((error) => {
      console.error('Error fetching emergency broadcast:', error);
    });
}

// Call the functions to fetch NOAA data
fetchCurrentWeather();
fetchEmergencyBroadcast();








// Replace 'YOUR_EPA_API_KEY' with your actual EPA API key
const epaApiKey = 'bolehawk73';

// Define the URL for the EPA AQS API endpoint
const epaApiUrl = `https://aqs.epa.gov/data/api/dailyData/byCounty`;

// Make an API request for air quality data
fetch(epaApiUrl, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${epaApiKey}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    // Process the air quality data and add it as a layer on your Leaflet map
    console.log(data);
    // Implement map integration and layer creation here
  })
  .catch((error) => {
    console.error('Error fetching air quality data:', error);
  });

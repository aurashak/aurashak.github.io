document.addEventListener("DOMContentLoaded", function () {
  // ... Your existing code ...

  const apiKey = '7aac7c91785ec3578082ffc8aac1c88a';
  const city = 'New York';

  // Fetch current weather data
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      // Handle the current weather data here and update your ticker
      console.log(data);

      // Extract relevant data
      const temperatureCelsius = data.main.temp;
      const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
      const humidity = data.main.humidity;
      const description = data.weather[0].description;

      // Update the ticker with current weather information
      const weatherInfo = document.getElementById('weather-info');
      weatherInfo.textContent = `Temperature: ${temperatureCelsius}°C (${temperatureFahrenheit}°F), Humidity: ${humidity}%, Weather: ${description}`;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  // Fetch forecast data for the next day
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      // Handle the forecast data here and update your ticker with the relevant information
      console.log(data);

      // Assuming you want the forecast for the next day (index 8 corresponds to the next day)
      const nextDayForecast = data.list[8];
      const rain = nextDayForecast.rain ? nextDayForecast.rain['3h'] : 0;
      const sunrise = new Date(data.city.sunrise * 1000).toLocaleTimeString();
      const sunset = new Date(data.city.sunset * 1000).toLocaleTimeString();

      // Update the ticker with forecast information
      const weatherInfo = document.getElementById('weather-info');
      weatherInfo.textContent += `, Forecast (Next Day): Rain: ${rain} mm, Sunrise: ${sunrise}, Sunset: ${sunset}`;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  // ... Your existing code ...
});

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
      weatherInfo.innerHTML = `<span>Temp: ${temperatureCelsius}°C (${temperatureFahrenheit}°F)</span> <span>Humidity: ${humidity}%</span> <span>Weather: ${description}</span>`;
      
      // Add CSS styles to display all items in one line
      weatherInfo.style.display = 'flex';
      weatherInfo.style.flexDirection = 'row';
      weatherInfo.style.flexWrap = 'nowrap';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

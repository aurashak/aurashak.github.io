document.addEventListener("DOMContentLoaded", function () {
    // ... Your existing code ...

    const apiKey = '7aac7c91785ec3578082ffc8aac1c88a';
    const city = 'New York';

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Handle the weather data here and update your ticker
        console.log(data);
        
        // Update the ticker with weather information
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.textContent = `Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}`;
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // ... Your existing code ...
});

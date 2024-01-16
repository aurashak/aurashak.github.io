// Initialize the weather widget
var weatherWidget = new OpenWeatherMapWeatherWidget();

// Configure the widget
weatherWidget.options({
    key: '7aac7c91785ec3578082ffc8aac1c88a', // Replace with your OpenWeatherMap API key
    city: 'New York', // Specify the city for which you want weather information
    units: 'metric', // Choose the unit sysstem (metric, imperial, standard)
    container: 'weather-ticker', // ID of the HTML container for the widget
    mode: 'ticker', // Use ticker mode for continuous updates
    interval: 60000 // Set the update interval in milliseconds (e.g., 1 minute)
});

// Start the weather widget
weatherWidget.start();

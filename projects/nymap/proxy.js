const express = require('express');
const axios = require('axios'); // You may need to install the axios package using npm

const app = express();
const port = 3000; // Choose the port for your proxy server

// Define a route to proxy NOAA API requests
app.get('/noaa-api', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://www.ncdc.noaa.gov/cdo-web/webservices/v2/currentconditions', // NOAA API URL
      {
        headers: {
          'token': 'QHQrYMKYdGlBqiGiogmYgbSHiAQyVbjo', // Replace with your actual NOAA API key
        },
      }
    );
    res.json(data); // Send the API response back to the client
  } catch (error) {
    console.error('Error proxying NOAA API request:', error);
    res.status(500).send('Internal Server Error'); // Handle errors gracefully
  }
});

// Define a route to proxy EPA API requests
app.get('/epa-api', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://aqs.epa.gov/data/api/dailyData/byCounty', // EPA API URL
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer bolehawk73', // Replace with your actual EPA API key
        },
      }
    );
    res.json(data); // Send the API response back to the client
  } catch (error) {
    console.error('Error proxying EPA API request:', error);
    res.status(500).send('Internal Server Error'); // Handle errors gracefully
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});

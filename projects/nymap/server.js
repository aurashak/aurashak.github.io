const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to handle survey submissions
app.post('/submit-survey', (req, res) => {
    const surveyData = req.body;
    
    // Store the surveyData in your database or perform other processing
    
    res.json({ success: true, message: 'Survey submitted successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

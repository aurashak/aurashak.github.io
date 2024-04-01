console.log("Script loaded successfully.");

function fetchData(body, startDate, endDate) {
    console.log("Fetching data...");
    const params = new URLSearchParams({
        batch: '1',
        COMMAND: `'${body}'`,
        MAKE_EPHEM: 'YES',
        EPHEM_TYPE: 'OBSERVER',
        START_TIME: startDate,
        STOP_TIME: endDate,
        STEP_SIZE: '3600',
        CAL_FORMAT: 'BOTH',
        CSV_FORMAT: 'YES',
    });

    const apiUrl = `https://ssd.jpl.nasa.gov/horizons_batch.cgi?${params.toString()}`;
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = `${corsProxyUrl}${apiUrl}`;

    console.log("Fetching data from:", url);
    return fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log("Data fetched successfully.");
            return data.trim().split('\\n').slice(28).join('\\n');
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            throw error; // Rethrow the error to propagate it to the caller
        });
}

const body = '499'; // Earth
const startDate = '2024-03-31';
const endDate = '2024-04-01';

console.log("Calling fetchData function...");
fetchData(body, startDate, endDate)
    .then(data => {
        console.log("Data retrieved successfully:", data);
        const outputDiv = document.getElementById('output');
        outputDiv.textContent = data;
    })
    .catch(error => console.error("Error:", error));

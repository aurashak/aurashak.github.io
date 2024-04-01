const body = '499'; // Earth
const startDate = '2024-03-31';
const endDate = '2024-04-01';

fetchData(body, startDate, endDate)
    .then(data => {
        const outputDiv = document.getElementById('output');
        outputDiv.textContent = data;
    })
    .catch(error => console.error(error));
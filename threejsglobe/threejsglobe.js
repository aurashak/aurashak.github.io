fetch('https://ssd.jpl.nasa.gov/horizons_batch.cgi?batch=1&COMMAND=%27499%27&MAKE_EPHEM=%27YES%27&EPHEM_TYPE=%27OBSERVER%27&START_TIME=%272024-03-31%27&STOP_TIME=%272024-04-01%27&STEP_SIZE=%27600%27&CAL_FORMAT=%27BOTH%27&CSV_FORMAT=%27YES%27')
  .then(response => response.text())
  .then(data => {
    const outputDiv = document.getElementById('output');
    outputDiv.innerText = data;
  })
  .catch(error => console.error(error));
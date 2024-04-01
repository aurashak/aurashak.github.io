function fetchData(body, startDate, endDate) {
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

    return fetch(url)
        .then(response => response.text())
        .then(data => data.trim().split('\\n').slice(28).join('\\n'))
        .catch(error => console.error(error));
}
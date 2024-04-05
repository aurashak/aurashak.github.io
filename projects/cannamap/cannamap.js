        // Initialize the map
        var map = L.map('cannamap', {
            // Set initial center and zoom level
            center: [37.0902, -95.7129], // United States center coordinates
            zoom: 4,
            // Disable zooming and scrolling
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            dragging: false,
            boxZoom: false,
            keyboard: false,
            touchZoom: false
        });

        // Add the base layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Load US state boundaries GeoJSON data
        fetch('us_states.geojson')
            .then(response => response.json())
            .then(data => {
                // Create a GeoJSON layer with custom style
                L.geoJSON(data, {
                    style: {
                        fillColor: 'white', // Fill color
                        color: 'black',     // Border color
                        weight: 2            // Border weight
                    }
                }).addTo(map);
            });
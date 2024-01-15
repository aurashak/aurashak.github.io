        // Create a map centered at 125th street in Manhattan
        var map = L.map('map').setView([40.811550, -73.952370], 15);

        // Add OpenStreetMap tiles to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Add a marker for 125th street
        var marker = L.marker([40.811550, -73.952370]).addTo(map);
        marker.bindPopup("<b>125th Street</b>").openPopup();
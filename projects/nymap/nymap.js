// Define the bounds for the New York City Tri-State area
var bounds = L.latLngBounds(
    L.latLng(40.4774, -74.2591), // Southwest corner
    L.latLng(41.15, -73.3913)  // Northeast corner
);

// Create and configure the map with the specified bounds
var map = L.map('nymap', {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,   // Elastic effect on exceeding bounds
    minZoom: 10,
    maxZoom: 16
}).setView([40.7128, -74.0060], 12); // New York City coordinates

L.control.scale().addTo(map);


/*

// Add the search control
var searchControl = L.Control.geocoder({
    defaultMarkGeocode: false,
    position: 'topleft',
    placeholder: 'Search for an address...',
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);

*/

// Function to calculate marker size based on zoom level
function calculateMarkerSize(zoom) {
    var initialSize = 16; 
    var minSize = 6;

    var size = initialSize - (zoom - 3) * 5;
    return Math.max(size, minSize);
}


// Counties Layer
var nyccountiesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycboroughboundaries.geojson', {
    style: function (feature) {
        return {
            fillColor: 'grey',
            color: 'black',
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: .3
        };
    },
    onEachFeature: function (feature, layer) {
        // Add a popup for each feature
        layer.bindPopup(createCountyPopupContent(feature.properties));
    }
});

// Function to create popup content for counties
function createCountyPopupContent(properties) {
    // Customize this function based on your county properties
    return `<strong>COUNTY</strong><BR>
            <strong></strong> ${properties.boro_name}`;
}



// Base Map Layers
var satelliteLayer = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg', {
    style: function (feature) {
        return {};
    }
});

var openstreetmapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    style: function (feature) {
        return {};
    }
});

openstreetmapLayer.addTo(map);

// Load OSMBuildings layer after the base map layers
var osmb = new OSMBuildings(map);
osmb.on('load', function () {
    console.log('OSMBuildings layer loaded successfully.');
});
osmb.load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');


var baseLayers = {
    "Open Street Maps": openstreetmapLayer,
    "Satellite": satelliteLayer,
    "Outlines": nyccountiesLayer, 
    "3d Buildings (zoom in)": osmb, 
};

var layerControl = L.control.layers(baseLayers, null, {
    position: 'topright' 
}).addTo(map);









// Geojson layers and layer groups

// AQI sites
var aqisiteLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/aqisite.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'green',
            color: 'black',
            weight: 0,
            opacity: 0.0,
            fillOpacity: 0.5
        });
    }
});




// floodplain layer
var floodplainCheckbox = document.getElementById('floodplain');
var opacitySlider = document.getElementById('opacity-slider');
var floodplainLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson', {
    style: function (feature) {
        var opacityValue = parseFloat(opacitySlider.value);
        return {
            fillColor: '#ADD8E6',
            color: 'black',
            weight: 0,
            opacity: 0,
            fillOpacity: opacityValue 
        };
    }
});

// Add an event listener to the opacity slider
opacitySlider.addEventListener('input', function () {
    var opacityValue = parseFloat(opacitySlider.value);

    // Update the fillOpacity of the floodplain layer
    floodplainLayer.eachLayer(function (layer) {
        layer.setStyle({
            fillOpacity: opacityValue
        });
    });
});

// Add an event listener to the floodplain checkbox
floodplainCheckbox.addEventListener('change', function () {
    if (floodplainCheckbox.checked) {
        map.addLayer(floodplainLayer);
    } else {
        map.removeLayer(floodplainLayer);
    }
});











// Energy Layer Group
var energyLayerGroup = L.layerGroup();


// Major Oil Storage Layer
var majoroilstorageLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/majoroilstorage.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'black',
            color: 'black',
            weight: 0,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    },
    onEachFeature: function (feature, layer) {
        // Add a popup for each feature
        layer.bindPopup(createMajorOilStoragePopupContent(feature.properties));
    }
}).addTo(energyLayerGroup);

// Function to create popup content for major oil storage
function createMajorOilStoragePopupContent(properties) {
    // Customize this function based on your GeoJSON properties
    return `<strong>MAJOR OIL STORAGE:</strong><br><strong>Site Name:</strong> ${properties.SITENAME}<br><strong>Site Type:</strong> ${properties.SITETYPE}`;
}

// Power Plants Layer
var powerplantsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycpowerplants.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        var fillColor = getColorForFuelType(feature.properties.t_fuels);
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: fillColor,
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    },
    onEachFeature: function (feature, layer) {
        // Add a popup for each feature
        layer.bindPopup(createPowerPlantPopupContent(feature.properties));
    }
}).addTo(energyLayerGroup);

// Function to create popup content for power plants
function createPowerPlantPopupContent(properties) {
    // Customize this function based on your power plant properties
    return `<strong>POWER PLANTS</strong><br>
            <strong>Name:</strong> ${properties.Name}<br>
            <strong>Capacity:</strong> ${properties.t_Output} MW<br>
            <strong>Fuel Type:</strong> ${properties.t_fuels}`;
}

// Function to get color based on fuel type
function getColorForFuelType(fuelType) {
    // Customize this function based on your fuel type categories and colors
    switch (fuelType) {
        case 'Conventional Hydroelectric':
            return 'green';
        case 'Conventional Steam Coal':
            return 'brown';
        case 'Flywheels':
            return 'purple';
        case 'Hydroelectric Pumped Storage':
            return 'blue';
        case 'Landfill Gas':
            return 'orange';
        case 'Municipal Solid Waste':
            return 'red';
        case 'Natural Gas Fired Combined Cycle':
            return 'yellow';
        case 'Natural Gas Fired Combustion Turbine':
            return 'cyan';
        case 'Natural Gas Steam Turbine':
            return 'pink';
        case 'Petroleum Liquids':
            return 'olive';
        case 'Nuclear':
            return 'black';
        case 'Onshore Wind turbine':
            return 'teal';
        case 'Solar Photovoltaic':
            return 'lime';
        case 'Wood/Wood Waste Biomass':
            return 'grey';
        default:
            return '#FFC0CB'; // Default color
    }
}



// NY Gas Pipelines Layer
var nygaspipelinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson', {
    style: function (feature) {
        var size = calculateMarkerSize(map.getZoom());
        return {
            color: 'purple',
            weight: 3,
            opacity: 0.6
        };
    },
    onEachFeature: function (feature, layer) {
        // Add a popup for each feature
        layer.bindPopup(createGasPipelinePopupContent(feature.properties));
    }
}).addTo(energyLayerGroup);

// Function to create popup content for gas pipelines
function createGasPipelinePopupContent(properties) {
    // Customize this function based on your gas pipeline properties
    return `<strong>GAS PIPELINE:</strong> <br>
    <strong>Operator:</strong> ${properties.Operator}`;
}



// NY Transmission Lines Layer
var electrictransmissionlinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/electrictransmissionlines.geojson', {
    style: function (feature) {
        var size = calculateMarkerSize(map.getZoom());
        return {
            color: 'orange',
            weight: 3,
            opacity: 0.6
        };
    },
    onEachFeature: function (feature, layer) {
        // Add a popup for each feature
        layer.bindPopup(createTransmissionLinePopupContent(feature.properties));
    }
}).addTo(energyLayerGroup);

// Function to create popup content for transmission lines
function createTransmissionLinePopupContent(properties) {
    // Customize this function based on your transmission line properties
    return `    <strong>ELECTRIC TRANSMISSION LINES:</strong><br>

    <strong>Owner:</strong> ${properties.OWNER}<br>
            <strong>Type:</strong> ${properties.TYPE}<br>
            <strong>Voltage:</strong> ${properties.VOLTAGE}`;
}






// Waste Layer Group
var wasteLayerGroup = L.layerGroup();

// Waste Transfer Facility Layer
var wastetransferfacilityLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/wastetransferfacility.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'purple',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    },
    onEachFeature: function (feature, layer) {
        // Add a popup for each feature
        layer.bindPopup(createWasteTransferFacilityPopupContent(feature.properties));
    }
}).addTo(wasteLayerGroup);

// Function to create popup content for waste transfer facilities
function createWasteTransferFacilityPopupContent(properties) {
    // Customize this function based on your waste transfer facility properties
    return `<strong>WASTE TRANSFER</strong><BR>
            <strong>Name:</strong> ${properties.FACILITY_NAME}<br>
            <strong>Owner:</strong> ${properties.OWNER_NAME}`;
}


// NYC CSO Layer
var nycsoLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycso.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'brown',
            color: 'black',
            weight: 0,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(wasteLayerGroup);





// Wastewater Treatment Layer
var wastewatertreatmentLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/wastewatertreatment.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'red',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    },
    onEachFeature: function (feature, layer) {
        // Add a popup for each feature
        layer.bindPopup(createWastewaterTreatmentPopupContent(feature.properties));
    }
}).addTo(wasteLayerGroup);

// Function to create popup content for wastewater treatment facilities
function createWastewaterTreatmentPopupContent(properties) {
    // Customize this function based on your wastewater treatment facility properties
    return `<strong>WASTEWATER TREATMENT PLANT</strong><BR>
            <strong>District:</strong> ${properties['DISTRICT NAME']}`;
}





// Inactive Solid Waste Landfill Layer
var inactivesolidwastelandfillLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/inactivesolidwastelandfill.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'grey',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    },
    onEachFeature: function (feature, layer) {
        // Add a popup for each feature
        layer.bindPopup(createSolidWasteLandfillPopupContent(feature.properties));
    }
}).addTo(wasteLayerGroup);

// Function to create popup content for inactive solid waste landfill
function createSolidWasteLandfillPopupContent(properties) {
    // Customize this function based on your GeoJSON properties
    return `<strong>LANDFILL</strong><BR>
    <strong>Facility Name:</strong> ${properties.FACILITY_NAME}`;
}


// Recycling Facility Layer
var recyclingfacilityLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/recyclingfacility.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'orange',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    },
    onEachFeature: function (feature, layer) {
        // Add a popup for each feature
        layer.bindPopup(createRecyclingFacilityPopupContent(feature.properties));
    }
}).addTo(wasteLayerGroup);

// Function to create popup content for recycling facilities
function createRecyclingFacilityPopupContent(properties) {
    // Customize this function based on your recycling facility properties
    return `<strong>RECYCLING FACILITY</strong><BR>
            <strong>Name:</strong> ${properties.FACILITY_NAME}<br>
            <strong>Owner:</strong> ${properties.OWNER_NAME}`;
}



// NYC EJ sites Layer
var nycejsitesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycejsites.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            // Add any other marker styling you need
        });
    },
    style: function (feature) {
        // Adjust styling based on EJ Area type
        var ejAreaType = feature.properties['ejdesignat']; // Update property name

        // Define colors for each EJ Area type
        var ejAreaColors = {
            'EJ Area': 'rgba(255, 0, 0, 0.7)',               // Red
            'Not EJ Area': 'rgba(0, 255, 0, 0.7)',           // Green
            'Potential EJ Area': 'rgba(0, 0, 255, 0.7)'      // Blue
        };

        return {
            fillColor: ejAreaColors[ejAreaType],
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.7
        };
    },
    onEachFeature: function (feature, layer) {
        // You can add any additional actions or pop-up content here if needed
        layer.bindPopup("Census Tract: " + feature.properties.TRACTCE10 + "<br>EJ Area Type: " + feature.properties['ejdesignat']); // Update property name
    }
});





// Bus Depots Layer
var nycbusdepotsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycbusdepots.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'black',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.8
        });
    }
});


// Subway Layer
var nycsubwayLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycsubway.geojson', {
    style: function (feature) {
        var subwayLineName = feature.properties.name;

        // Define colors for each subway line
        var subwayLineColors = {
            '1': 'red',
            '1-2-3': 'red',
            '2': 'red',
            '3': 'red',
            'A': 'blue',
            'B': 'orange',
            'C': 'blue',
            'D': 'orange',
            'Q': 'yellow',
            'R': 'yellow',
            '4': 'green',
            '5': 'green',
            '6': 'green',
            '4-5-6': 'green',
            '7': 'purple',
            'A-C': 'blue',
            'A-C-E': 'blue',
            'B-D': 'orange',
            'B-D-F-M': 'orange',
            'F': 'orange',
            'E': 'blue',
            'F-M': 'orange',
            'G': 'lime',
            'J-Z': 'brown',
            'L': 'gray',
            'M': 'orange',
            'N': 'yellow',
            'N-Q-R': 'yellow',
            'N-R': 'yellow',
            'N-Q': 'yellow',
            'N-R-W': 'yellow',
            'N-W': 'yellow',
            'R-W': 'yellow',
            'S': 'gray'
        };

        return {
            color: subwayLineColors[subwayLineName] || 'gray', // Default color if not in the mapping
            weight: 3,
            opacity: 0.6
        };
    }
});



// State rail Layer
var nyrailLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nytrains.geojson', {
    style: function (feature) {
        var railowner = feature.properties.railowner;

        // Check if the railowner is Long Island Rail Road
        if (railowner === 'Long Island Rail Road') {
            return {
                color: 'blue',
                weight: 3,
                opacity: 0.6
            };
        }
        // Check if the railowner is Metro North Commuter Railroad Company
        else if (railowner === 'Metro North Commuter Railroad Company') {
            return {
                color: 'red',
                weight: 3,
                opacity: 0.6
            };
        }
        // Default style for other rail lines (make them invisible)
        else {
            return {
                opacity: 0,
                fillOpacity: 0
            };
        }
    }
});











// Chemical Storage Layer
var chemicalstorageLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/chemicalstorage.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'blue',
            color: 'black',
            weight: 0,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    },
    onEachFeature: function (feature, layer) {
        // Add a popup for each feature
        layer.bindPopup(createChemicalStoragePopupContent(feature.properties));
    }
});

// Function to create popup content for chemical storage
function createChemicalStoragePopupContent(properties) {
    // Customize this function based on your chemical storage properties
    return `<strong>CHEMICAL STORAGE</strong><br>
            <strong>Name:</strong> ${properties.SITENAME}<br>
            <strong>Type:</strong> ${properties.SITETYPE}`;
}




// Cultural Institutions Layer
var culturalinsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/culturalins.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        var discipline = feature.properties["Discipline"];
        var markerColor = getColorForDiscipline(discipline);
        
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: markerColor,
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.7
        });
    },
    onEachFeature: function (feature, layer) {
        var organizationName = feature.properties["Organization Name"];
        layer.bindPopup('<b>' + organizationName + '</b>');
    }
});

// Function to get color based on discipline
function getColorForDiscipline(discipline) {
    switch (discipline) {
        case 'Zoo':
            return 'green';
        case 'Visual Arts':
            return 'blue';
        case 'Theatre':
            return 'red';
        case 'Science':
            return 'purple';
        case 'Photography':
            return 'orange';
        case 'Other':
            return 'brown';
        case 'New Media':
            return 'pink';
        case 'Music':
            return 'yellow';
        case 'Multi-disciplinary':
            return 'teal';
        case 'Literature':
            return 'lime';
        case 'Film/Video/Audio':
            return 'cyan';
        case 'Dance':
            return 'magenta';
        case 'Crafts':
            return 'olive';
        case 'Botanical':
            return 'navy';
        case 'Architecture/Design':
            return 'gray';
        default:
            return 'gray'; // Default color for unknown disciplines
    }
}



// Evacuation Zones Layer
var evacuationzonesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/evacuationzones.geojson', {
    style: function (feature) {
        var category = feature.properties.HURRICANE_;
        return {
            fillColor: getEvacuationZoneColor(category),
            color: 'black',
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: 0.5
        };
    },
    onEachFeature: function (feature, layer) {
        // You can add any additional actions or pop-up content here if needed
        layer.bindPopup("Evacuation Zone Name: " + feature.properties.NAME);
    }
});

// Function to get the evacuation zone color based on the category
function getEvacuationZoneColor(category) {
    switch (category) {
        case '1':
            return '#570019'; // Dark Red
        case '2':
            return '#94002a'; // Deep Red
        case '3':
            return '#ff0d51'; // Red
        case '4':
            return '#f74a7b'; // Pink
        case '5':
            return '#ffadc5'; // Light Pink
        case '6':
            return '#ffdbe5'; // Pale Pink
        default:
            return 'rgba(128, 128, 128, 0.5)'; // Default color for unknown categories (Transparent Grey)
        }
}




// Remediation Sites Layer with Polygon Markers
console.log('Loading Remediation Sites geoJSON data...');
var remediationsitesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/remediationsites.geojson', {
    style: function (feature) {
        return {
            fillColor: 'red',
            color: 'black',
            weight: 0.5,
            opacity: 1,
            fillOpacity: 1
        };
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup("Site Name: " + feature.properties.SITENAME);
    },
    success: function (data) {
        console.log('Remediation Sites geoJSON data loaded successfully.');
    },
    error: function (error) {
        console.error('Error loading Remediation Sites geoJSON data:', error);
    }
});

// Add the remediation sites layer to the map
remediationsitesLayer.addTo(map);






// Function to get income category based on MHI value
function getIncomeCategory(income) {
    if (income <= 30000) {
        return '0-30000';
    } else if (income <= 60000) {
        return '30000-60000';
    } else if (income <= 90000) {
        return '60000-90000';
    } else if (income <= 150000) {
        return '90000-150000';
    } else {
        return '150000-250000';
    }
}

// NYC Average Income Layer
var avgIncomeLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycavgincome.geojson', {
    style: function (feature) {
        // Adjust styling based on income level
        var income = feature.properties.MHI;
        var category = getIncomeCategory(income);

    // Define colors for each category
    var categoryColors = {
        '0-30000': 'rgba(254, 224, 139, 0.7)',    // Adding alpha channel (0.7 for 70% opacity)
        '30000-60000': 'rgba(253, 174, 97, 0.7)',
        '60000-90000': 'rgba(215, 48, 39, 0.7)',
        '90000-150000': 'rgba(69, 117, 180, 0.7)',
        '150000-250000': 'rgba(49, 54, 149, 0.7)'
    };
    



        return {
            fillColor: categoryColors[category],
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.7
        };
    },
    onEachFeature: function (feature, layer) {
        // You can add any additional actions or pop-up content here if needed
        layer.bindPopup("Census Tract: " + feature.properties.TRACTCE10 + "<br>Income: $" + feature.properties.MHI);
    }
});


var avgIncomeCheckbox = document.getElementById('avgIncomeLayer');

// Add an event listener to the average income checkbox
avgIncomeCheckbox.addEventListener('change', function () {
    if (avgIncomeCheckbox.checked) {
        map.addLayer(avgIncomeLayer);
    } else {
        map.removeLayer(avgIncomeLayer);
    }
});





// Function to get population category based on population value
function getPopulationCategory(population) {
    if (population <= 1000) {
        return '0-1000';
    } else if (population <= 3000) {
        return '1000-3000';
    } else if (population <= 6000) {
        return '3000-6000';
    } else if (population <= 10000) {
        return '6000-10000';
    } else if (population <= 15000) {
        return '10000-14000';
    } else if (population <= 18000) {
        return '14000-17000';
    } else {
        return '17000+';
    }
}

// NYC Population Layer
var populationLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/ctpop2020.geojson', {
    style: function (feature) {
        // Adjust styling based on population level
        var population = feature.properties.population; // Update to lowercase 'population'
        var category = getPopulationCategory(population);

 // Define colors for each category as a gradient with transparency
var categoryColors = {
    '0-1000': '#4575b4', // White
    '1000-3000': '#e3e2e1', // Light Gray
    '3000-6000': '#b8b8b8', // Dark Gray
    '6000-10000': '#919190', // Gray
    '10000-14000': '#5c5c5c', // Dim Gray
    '14000-17000': '#2e2e2e', // Dark Slate Gray
    '17000+': '#000' // Black
    
};




        return {
            fillColor: categoryColors[category],
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.7
        };
    },
    onEachFeature: function (feature, layer) {
        // You can add any additional actions or pop-up content here if needed
        layer.bindPopup("Census Tract: " + feature.properties.TRACTCE10 + "<br>Population: " + feature.properties.population); // Update to lowercase 'population'
    }
});

var populationCheckbox = document.getElementById('populationLayer');

// Add an event listener to the population checkbox
populationCheckbox.addEventListener('change', function () {
    if (populationCheckbox.checked) {
        map.addLayer(populationLayer);
    } else {
        map.removeLayer(populationLayer);
    }
});



/* 

// Census Tract Layer
var ctpop2020Layer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/ctpop2020.geojson').addTo(map);

// Object to store counts for each census tract
var censusTractCounts = {};

// Checkbox for Census Tract Layer
var censusTractCheckbox = document.getElementById('censusTractLayer');

// Event listener for when the CSO layer is loaded
nycsoLayer.on('data:loaded', function () {
    // Reset counts
    censusTractCounts = {};

    // Iterate over CSO layer features
    nycsoLayer.eachLayer(function (layer) {
        // Get the census tract ID from CSO layer properties
        var censusTractID = layer.feature.properties.census_tract;

        // Initialize count if not already present
        censusTractCounts[censusTractID] = (censusTractCounts[censusTractID] || 0) + 1;
    });

    // Find the census tract with the highest count
    var maxCount = 0;
    var maxCensusTractID;

    for (var tractID in censusTractCounts) {
        if (censusTractCounts.hasOwnProperty(tractID) && censusTractCounts[tractID] > maxCount) {
            maxCount = censusTractCounts[tractID];
            maxCensusTractID = tractID;
        }
    }

    // Reset styles for all census tracts
    ctpop2020Layer.setStyle({ fillColor: 'grey', color: 'black', weight: 0.5 });

    // Highlight the census tract with the highest count
    ctpop2020Layer.eachLayer(function (layer) {
        if (layer.feature.properties.census_tract === maxCensusTractID) {
            switch (maxCount) {
                case 1:
                    // Add styling or actions for maxCount = 1
                    layer.setStyle({ fillColor: 'red' });
                    break;
                case 2:
                    // Add styling or actions for maxCount = 2
                    layer.setStyle({ fillColor: 'blue' });
                    break;
                // Add more cases as needed
                default:
                    // Default styling or actions
                    layer.setStyle({ fillColor: 'green' });
            }
            console.log('Census Tract with the highest CSO count:', maxCensusTractID);
        }
    });
});

// Add an event listener to the Census Tract layer checkbox
censusTractCheckbox.addEventListener('change', function () {
    if (censusTractCheckbox.checked) {
        map.addLayer(ctpop2020Layer);
    } else {
        map.removeLayer(ctpop2020Layer);
    }
});

// Ensure that the checkbox state is initially set correctly
if (censusTractCheckbox.checked) {
    map.addLayer(ctpop2020Layer);
} else {
    map.removeLayer(ctpop2020Layer);
}

*/



document.getElementById('nycso').addEventListener('change', function() {
    if (map.hasLayer(nycsoLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('nycso').checked) {
            return;
        }
        map.removeLayer(nycsoLayer);
    } else {
        map.addLayer(nycsoLayer);
    }
});



document.getElementById('floodplain').addEventListener('click', function() {
    if (map.hasLayer(floodplainLayer)) {
        map.removeLayer(floodplainLayer);
    } else {
        map.addLayer(floodplainLayer);
    }
});




document.getElementById('majoroilstorage').addEventListener('change', function() {
    if (map.hasLayer(majoroilstorageLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('majoroilstorage').checked) {
            return;
        }
        map.removeLayer(majoroilstorageLayer);
    } else {
        map.addLayer(majoroilstorageLayer);
    }
});


document.getElementById('powerplants').addEventListener('change', function() {
    if (map.hasLayer(powerplantsLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('powerplants').checked) {
            return;
        }
        map.removeLayer(powerplantsLayer);
    } else {
        map.addLayer(powerplantsLayer);
    }
});


document.getElementById('nygaspipelines').addEventListener('change', function() {
    if (map.hasLayer(nygaspipelinesLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('nygaspipelines').checked) {
            return;
        }
        map.removeLayer(nygaspipelinesLayer);
    } else {
        map.addLayer(nygaspipelinesLayer);
    }
});



document.getElementById('wastetransferfacility').addEventListener('click', function() {
    if (map.hasLayer(wastetransferfacilityLayer)) {
        map.removeLayer(wastetransferfacilityLayer);
    } else {
        map.addLayer(wastetransferfacilityLayer);
    }
});

document.getElementById('wastetransferfacility').addEventListener('change', function() {
    if (map.hasLayer(wastetransferfacilityLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (!document.getElementById('wastetransferfacility').checked) {
            map.removeLayer(wastetransferfacilityLayer);
        }
    } else {
        map.addLayer(wastetransferfacilityLayer);
    }
});

document.getElementById('inactivesolidwastelandfill').addEventListener('change', function() {
    if (map.hasLayer(inactivesolidwastelandfillLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('inactivesolidwastelandfill').checked) {
            return;
        }
        map.removeLayer(inactivesolidwastelandfillLayer);
    } else {
        map.addLayer(inactivesolidwastelandfillLayer);
    }
});


document.getElementById('recyclingfacility').addEventListener('change', function() {
    if (map.hasLayer(recyclingfacilityLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('recyclingfacility').checked) {
            return;
        }
        map.removeLayer(recyclingfacilityLayer);
    } else {
        map.addLayer(recyclingfacilityLayer);
    }
});


document.getElementById('chemicalstorage').addEventListener('click', function() {
    if (map.hasLayer(chemicalstorageLayer)) {
        map.removeLayer(chemicalstorageLayer);
    } else {
        map.addLayer(chemicalstorageLayer);
    }
});


document.getElementById('culturalins').addEventListener('click', function() {
    if (map.hasLayer(culturalinsLayer)) {
        map.removeLayer(culturalinsLayer);
    } else {
        map.addLayer(culturalinsLayer);
    }
});




document.getElementById('aqisite').addEventListener('click', function() {
    if (map.hasLayer(aqisiteLayer)) {
        map.removeLayer(aqisiteLayer);
    } else {
        map.addLayer(aqisiteLayer);
    }
});

document.getElementById('electrictransmissionlines').addEventListener('change', function() {
    if (map.hasLayer(electrictransmissionlinesLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('electrictransmissionlines').checked) {
            return;
        }
        map.removeLayer(electrictransmissionlinesLayer);
    } else {
        map.addLayer(electrictransmissionlinesLayer);
    }
});

document.getElementById('wastewatertreatment').addEventListener('change', function() {
    if (map.hasLayer(wastewatertreatmentLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('wastewatertreatment').checked) {
            return;
        }
        map.removeLayer(wastewatertreatmentLayer);
    } else {
        map.addLayer(wastewatertreatmentLayer);
    }
});






// Event listener for the nycejsites layer toggle
document.getElementById('nycejsites').addEventListener('change', function() {
    if (map.hasLayer(nycejsitesLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('nycejsites').checked) {
            return;
        }
        map.removeLayer(nycejsitesLayer);
    } else {
        map.addLayer(nycejsitesLayer);
    }
});






// Event listener for the nycbusdepots layer toggle
document.getElementById('nycbusdepots').addEventListener('change', function() {
    if (map.hasLayer(nycbusdepotsLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('nycbusdepots').checked) {
            return;
        }
        map.removeLayer(nycbusdepotsLayer);
    } else {
        map.addLayer(nycbusdepotsLayer);
    }
});


// Event listener for the nycsubway layer toggle
document.getElementById('nycsubway').addEventListener('change', function() {
    // Check if the layer is currently on the map
    if (map.hasLayer(nycsubwayLayer)) {
        // If the layer is on, remove it when switching left to right
        if (!document.getElementById('nycsubway').checked) {
            map.removeLayer(nycsubwayLayer);
        }
    } else {
        // If the layer is off, add it when switching right to left
        if (document.getElementById('nycsubway').checked) {
            map.addLayer(nycsubwayLayer);
        }
    }
});

// Event listener for the nyrail layer toggle
document.getElementById('nyrail').addEventListener('change', function() {
    // Check if the switch is checked
    if (document.getElementById('nyrail').checked) {
        // If the switch is checked, add the layer
        map.addLayer(nyrailLayer);
    } else {
        // If the switch is unchecked, remove the layer
        map.removeLayer(nyrailLayer);
    }
});











document.getElementById('evacuationzones').addEventListener('click', function() {
    if (map.hasLayer(evacuationzonesLayer)) {
        map.removeLayer(evacuationzonesLayer);
    } else {
        map.addLayer(evacuationzonesLayer);
    }
});



document.getElementById('remediationsites').addEventListener('change', function() {
    if (map.hasLayer(remediationsitesLayer)) {
        // If the layer is already on, do nothing when switching left to right
        if (document.getElementById('remediationsites').checked) {
            return;
        }
        map.removeLayer(remediationsitesLayer);
        console.log('Remediation Sites layer turned off.');
    } else {
        map.addLayer(remediationsitesLayer);
        console.log('Remediation Sites layer turned on.');
    }
});



document.getElementById('energyLayerGroup').addEventListener('click', function() {
    if (map.hasLayer(energyLayerGroup)) {
        map.removeLayer(energyLayerGroup);
        // If the group toggle is turned off, turn off individual layers as well
        map.removeLayer(majoroilstorageLayer);
        map.removeLayer(powerplantsLayer);
        map.removeLayer(nygaspipelinesLayer);
        map.removeLayer(electrictransmissionlinesLayer);

        // Reset the individual layer toggle buttons to off state
        document.getElementById('majoroilstorage').checked = false;
        document.getElementById('powerplants').checked = false;
        document.getElementById('nygaspipelines').checked = false;
        document.getElementById('electrictransmissionlines').checked = false;

    } else {
        map.addLayer(energyLayerGroup);
        // If the group toggle is turned on, turn on individual layers if they were previously checked
        if (document.getElementById('majoroilstorage').checked) {
            map.addLayer(majoroilstorageLayer);
        }
        if (document.getElementById('powerplants').checked) {
            map.addLayer(powerplantsLayer);
        }
        if (document.getElementById('nygaspipelines').checked) {
            map.addLayer(nygaspipelinesLayer);
        }
        if (document.getElementById('electrictransmissionlines').checked) {
            map.addLayer(electrictransmissionlinesLayer);
        }
    }
});



// Water Layer Group
/*  var waterLayerGroup = L.layerGroup();  */

// ...

// Remove this block of code related to the water layer group
/*
if (false) {
    document.getElementById('waterLayerGroup').addEventListener('click', function() {
        if (map.hasLayer(waterLayerGroup)) {
            map.removeLayer(waterLayerGroup);
            // If the group toggle is turned off, turn off individual layers as well
            map.removeLayer(floodplainLayer);
            map.removeLayer(nycsoLayer);
            // Reset the individual layer toggle buttons to off state
            document.getElementById('floodplain').checked = false;
            document.getElementById('nycso').checked = false;
        } else {
            map.addLayer(waterLayerGroup);
            // If the group toggle is turned on, turn on individual layers if they were previously checked
            if (document.getElementById('floodplain').checked) {
                map.addLayer(floodplainLayer);
            }
            if (document.getElementById('nycso').checked) {
                map.addLayer(nycsoLayer);
            }
        }
    });
}
*/


// Toggle Waste Layer Group
document.getElementById('wasteLayerGroup').addEventListener('click', function() {
    if (map.hasLayer(wasteLayerGroup)) {
        map.removeLayer(wasteLayerGroup);
        // If the group toggle is turned off, turn off individual layers as well
        map.removeLayer(wastetransferfacilityLayer);
        map.removeLayer(wastewatertreatmentLayer);
        map.removeLayer(inactivesolidwastelandfillLayer);
        map.removeLayer(nycsoLayer);
        map.removeLayer(recyclingfacilityLayer);
        // Reset the individual layer toggle buttons to off state
        document.getElementById('wastetransferfacility').checked = false;
        document.getElementById('wastewatertreatment').checked = false;
        document.getElementById('nycso').checked = false;
        document.getElementById('inactivesolidwastelandfill').checked = false;
        document.getElementById('recyclingfacility').checked = false;
    } else {
        map.addLayer(wasteLayerGroup);
        // If the group toggle is turned on, turn on individual layers if they were previously checked
        if (document.getElementById('wastetransferfacility').checked) {
            map.addLayer(wastetransferfacilityLayer);
        }
        if (document.getElementById('wastewatertreatment').checked) {
            map.addLayer(wastewatertreatmentLayer);
        }
        if (document.getElementById('inactivesolidwastelandfill').checked) {
            map.addLayer(inactivesolidwastelandfillLayer);
        }
        if (document.getElementById('nycso').checked) {
            map.addLayer(nycsoLayer);
        }
        if (document.getElementById('recyclingfacility').checked) {
            map.addLayer(recyclingfacilityLayer);
        }
    }
});










// Function to set legend symbols with support for multiple shapes, colors, and images
function setLegendSymbol(layerId, colors, shape, imageUrl, options) {
    const legendSymbol = document.getElementById(`legend-${layerId}`);
    
    if (legendSymbol) {
        // Check if 'colors' is an object (for income categories) or a string (for single color)
        if (typeof colors === 'object') {
            let legendHTML = '';
            for (const category in colors) {
                const color = colors[category];
                legendHTML += createLegendEntry(category, color, shape, imageUrl);
            }
            // Set the legend HTML
            legendSymbol.innerHTML = legendHTML;
        } else if (typeof colors === 'string') {
            // Set legend HTML for a single color and shape
            legendSymbol.innerHTML = createLegendEntry('', colors, shape, imageUrl);
        }
    }
}

// Function to create a legend entry based on shape, color, and image
function createLegendEntry(label, color, shape, imageUrl) {
    switch (shape) {
        case 'circle':
            return `<div><svg width="25" height="25"><circle cx="12.5" cy="12.5" r="10" fill="${color}" /></svg>${label}</div>`;
        case 'line':
            return `<div><svg width="25" height="25"><line x1="2.5" y1="12.5" x2="22.5" y2="12.5" stroke="${color}" stroke-width="5" /></svg>${label}</div>`;
        case 'polygon':
            return `<div><svg width="25" height="25"><polygon points="2.5,2.5 2.5,22.5 22.5,22.5 22.5,2.5" fill="${color}" /></svg>${label}</div>`;
        case 'imageUrl':
            return `<div><img src="${imageUrl}" alt="${label}" class="legend-image">${label}</div>`;
        default:
            return ''; // Handle other shapes if needed
    }
}


// Legend symbol shapes, colors, and images for each layer
setLegendSymbol('electrictransmissionlines', 'orange', 'line');
setLegendSymbol('aqisite', 'green', 'circle');
setLegendSymbol('chemicalstorage', 'blue', 'circle');

setLegendSymbol('maxCountCensusTract', 'red', 'polygon');
setLegendSymbol('nycbusdepots', 'black', 'circle');





setLegendSymbol('recyclingfacility', 'orange', 'circle');
setLegendSymbol('nycso', 'brown', 'circle');
setLegendSymbol('nygaspipelines', 'purple', 'line');
setLegendSymbol('nycsubway', 'blue', 'imageUrl', 'https://aurashak.github.io/images/mtalogo.png');
// Set legend symbols for Long Island Rail Road (nyrail)
setLegendSymbol('nyrail-longisland', 'blue', 'line');

// Set legend symbols for Metro North Commuter Railroad Company (nyrail)
setLegendSymbol('nyrail-metronorth', 'red', 'line');

setLegendSymbol('wastewatertreatment', 'red', 'circle');
setLegendSymbol('wastetransferfacility', 'purple', 'circle');
setLegendSymbol('majoroilstorage', 'black', 'circle');
setLegendSymbol('inactivesolidwastelandfill', 'grey', 'circle');
setLegendSymbol('floodplain', '#ADD8E6', 'polygon');
setLegendSymbol('remediationsites', 'red', 'polygon');
setLegendSymbol('censusTractLayer', 'green', 'polygon');
setLegendSymbol('avgIncome', {'$0 - $30,000': '#fee08b', '$30,000 - $60,000': '#fdae61', '$60,000 - $90,000': '#d73027', '$90,000 - $150,000': '#4575b4', '$150,000 - $250,000': '#313695'}, 'polygon', { layout: 'vertical' });

setLegendSymbol('nycejsites', {'EJ Area': 'rgba(255, 0, 0, 0.7)', 'Not EJ Area': 'rgba(0, 255, 0, 0.7)', 'Potential EJ Area': 'rgba(0, 0, 255, 0.7)'}, 'polygon', { layout: 'vertical' });

setLegendSymbol('evacuationzones', {
    '1': '#ffdbe5', 
    '2': '#ffadc5', 
    '3': '#f74a7b', 
    '4': '#ff0d51', 
    '5': '#94002a', 
    '6': '#570019',
    'default': 'rgba(128, 128, 128, 0.5)' // Transparent Grey for unknown categories
}, 'polygon');



// Legend for Population Layer (white to dark gray colors)
setLegendSymbol('population', {
    '0-1000': '#4575b4',  
    '1000-3000': '#e3e2e1', // 
    '3000-6000': '#b8b8b8', // 
    '6000-10000': '#919190', // 
    '10000-14000': '#5c5c5c', //
    '14000-17000': '#2e2e2e', // 
    '17000+': '#000'  // Black
}, 'polygon', { layout: 'vertical', id: 'legend-population' });


// Legend for Power Plants Layer (colors for each fuel type)
setLegendSymbol('powerplants', {
    'Conventional Hydroelectric': 'green',
    'Conventional Steam Coal': 'brown',
    'Flywheels': 'purple',
    'Hydroelectric Pumped Storage': 'blue',
    'Landfill Gas': 'orange',
    'Municipal Solid Waste': 'red',
    'Natural Gas Fired Combined Cycle': 'yellow',
    'Natural Gas Fired Combustion Turbine': 'cyan',
    'Natural Gas Steam Turbine': 'pink',
    'Petroleum Liquids': 'olive',
    'Nuclear': 'black',
    'Onshore Wind turbine': 'teal',
    'Solar Photovoltaic': 'lime',
    'Wood/Wood Waste Biomass': 'grey'
}, 'circle');


// Set legend symbols for Cultural Institutions Layer
setLegendSymbol('culturalins', {
    'Zoo': 'green',
    'Visual Arts': 'blue',
    'Theatre': 'red',
    'Science': 'purple',
    'Photography': 'orange',
    'Other': 'brown',
    'New Media': 'pink',
    'Music': 'yellow',
    'Multi-disciplinary': 'teal',
    'Literature': 'lime',
    'Film/Video/Audio': 'cyan',
    'Dance': 'magenta',
    'Crafts': 'olive',
    'Botanical': 'navy',
    'Architecture/Design': 'gray'
}, 'circle');

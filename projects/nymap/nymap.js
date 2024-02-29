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

// Function to calculate marker size based on zoom level
function calculateMarkerSize(zoom) {
    var initialSize = 16; 
    var minSize = 6;

    var size = initialSize - (zoom - 3) * 5;
    return Math.max(size, minSize);
}


var nyccountiesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nyccounties.geojson', {
    style: function (feature) {
        return {
            fillColor: 'grey',
            color: 'black',
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: .3
        };
    },
    pointToLayer: function (feature, latlng) {
        // Get the county name from the 'NAME' property
        var countyName = feature.properties.NAME;

        // Create a label marker with the county name as the label
        return L.marker(latlng, {
            icon: L.divIcon({
                className: 'leaflet-div-label',
                html: countyName, // Use the 'NAME' property as the label
                iconSize: [100, 40] // Adjust the size of the label marker
            })
        });
    }
});




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
    "OpenStreetMap": openstreetmapLayer,
    "Satellite": satelliteLayer,
    "Outlines": nyccountiesLayer, 
    "3d Buildings": osmb, 
};

var layerControl = L.control.layers(baseLayers, null, {
    position: 'topright' 
}).addTo(map);





// OSM Buildings layers //

var osmb = new OSMBuildings(map).load();

var
  now,
  date, time,
  timeRange, dateRange,
  timeRangeLabel, dateRangeLabel;

function changeDate() {
  var Y = now.getFullYear(),
    M = now.getMonth(),
    D = now.getDate(),
    h = now.getHours(),
    m = 0;

  timeRangeLabel.innerText = pad(h) + ':' + pad(m);
  dateRangeLabel.innerText = Y + '-' + pad(M+1) + '-' + pad(D);

  osmb.date(new Date(Y, M, D, h, m));
}

function onTimeChange() {
  now.setHours(this.value);
  now.setMinutes(0);
  changeDate();
}

function onDateChange() {
  now.setMonth(0);
  now.setDate(this.value);
  changeDate();
}

function pad(v) {
  return (v < 10 ? '0' : '') + v;
}

timeRange = document.getElementById('time');
dateRange = document.getElementById('date');
timeRangeLabel = document.querySelector('*[for=time]');
dateRangeLabel = document.querySelector('*[for=date]');

now = new Date;
changeDate();

// init with day of year
var Jan1 = new Date(now.getFullYear(), 0, 1);
dateRange.value = Math.ceil((now-Jan1)/86400000);

timeRange.value = now.getHours();

timeRange.addEventListener('change', onTimeChange);
dateRange.addEventListener('change', onDateChange );
timeRange.addEventListener('input', onTimeChange);
dateRange.addEventListener('input', onDateChange);

//************************************************************

// load extra information
function ajax(url, callback) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState !== 4) {
      return;
    }
    if (!req.status || req.status < 200 || req.status > 299) {
      return;
    }

    callback(JSON.parse(req.responseText));
  };
  req.open('GET', url);
  req.send(null);
}

// formatted json output
function formatJSON(json) {
  var html = '';
  for (var key in json) {
    html += '<em>'+ key +'</em> '+ json[key] +'<br>';
  }
  return html;
}

osmb.click(function(e) {
  var url = 'https://data.osmbuildings.org/0.2/uejws863/feature/'+ e.feature +'.json';
  ajax(url, function(json) {
    var content = '<b>OSM ID '+ e.feature +'</b>';
    for (var i = 0; i < json.features.length; i++) {
      content += '<br><em>OSM Part ID</em> '+ json.features[i].id;
      content += '<br>'+ formatJSON(json.features[i].properties.tags);
    }

    L.popup({ maxHeight:200, autoPanPaddingTopLeft:[50,50] })
      .setLatLng(L.latLng(e.lat, e.lon))
      .setContent(content)
      .openOn(map);
  });
});







// Geojson layers and layer groups //

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
    }
}).addTo(energyLayerGroup);

// Power Plants Layer
var powerplantsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nycpowerplants.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: '#FFC0CB',
            color: 'black',
            weight: 0.5,
            opacity: 0.7,
            fillOpacity: 0.5
        });
    }
}).addTo(energyLayerGroup);

// NY Gas Pipelines Layer
var nygaspipelinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson', {
    style: function (feature) {
        var size = calculateMarkerSize(map.getZoom());
        return {
            color: 'purple',
            weight: 3,
            opacity: 0.6
        };
    }
}).addTo(energyLayerGroup);

// NY Transmission Lines Layer
var electrictransmissionlinesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/electrictransmissionlines.geojson', {
    style: function (feature) {
        var size = calculateMarkerSize(map.getZoom());
        return {
            color: 'orange',
            weight: 3,
            opacity: 0.6
        };
    }
}).addTo(energyLayerGroup);





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
    }
}).addTo(wasteLayerGroup);

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
    }
}).addTo(wasteLayerGroup);

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
    }
}).addTo(wasteLayerGroup);

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
    }
}).addTo(wasteLayerGroup);



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
    }
});

// Cultural Institutions Layer
var culturalinsLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/culturalins.geojson', {
    pointToLayer: function (feature, latlng) {
        var size = calculateMarkerSize(map.getZoom());
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: 'yellow',
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

var evacuationzonesLayer = L.geoJSON.ajax('https://aurashak.github.io/geojson/nyc/evacuationzones.geojson', {
    style: function (feature) {
        return {
            fillColor: 'red',
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
            '0-30000': '#fee08b',
            '30000-60000': '#fdae61',
            '60000-90000': '#d73027',
            '90000-150000': '#4575b4',
            '150000-250000': '#313695'
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



// Function to set legend symbols with support for multiple shapes and colors
function setLegendSymbol(layerId, colors, shape) {
    const legendSymbol = document.getElementById(`legend-${layerId}`);
    
    if (legendSymbol) {
        // Check if 'colors' is an object (for income categories) or a string (for single color)
        if (typeof colors === 'object') {
            let legendHTML = '';
            for (const category in colors) {
                const color = colors[category];
                legendHTML += createLegendEntry(category, color, shape);
            }
            // Set the legend HTML
            legendSymbol.innerHTML = legendHTML;
        } else if (typeof colors === 'string') {
            // Set legend HTML for a single color and shape
            legendSymbol.innerHTML = createLegendEntry('', colors, shape);
        }
    }
}

// Function to create a legend entry based on shape and color
function createLegendEntry(label, color, shape) {
    switch (shape) {
        case 'circle':
            return `<div><svg width="25" height="25"><circle cx="12.5" cy="12.5" r="10" fill="${color}" /></svg>${label}</div>`;
        case 'line':
            return `<div><svg width="25" height="25"><line x1="2.5" y1="12.5" x2="22.5" y2="12.5" stroke="${color}" stroke-width="5" /></svg>${label}</div>`;
        case 'polygon':
            return `<div><svg width="25" height="25"><polygon points="2.5,2.5 2.5,22.5 22.5,22.5 22.5,2.5" fill="${color}" /></svg>${label}</div>`;
        default:
            return ''; // Handle other shapes if needed
    }
}

// legend symbol shapes and colors for each layer
setLegendSymbol('evacuationzones', 'red', 'polygon');
setLegendSymbol('electrictransmissionlines', 'orange', 'line');
setLegendSymbol('aqisite', 'green', 'circle');
setLegendSymbol('chemicalstorage', 'blue', 'circle');
setLegendSymbol('culturalins', 'yellow', 'circle');
setLegendSymbol('recyclingfacility', 'orange', 'circle');
setLegendSymbol('nycso', 'brown', 'circle');
setLegendSymbol('nygaspipelines', 'purple', 'line');
setLegendSymbol('powerplants', '#FFC0CB', 'circle');
setLegendSymbol('wastewatertreatment', 'red', 'circle');
setLegendSymbol('wastetransferfacility', 'purple', 'circle');
setLegendSymbol('majoroilstorage', 'black', 'circle');
setLegendSymbol('inactivesolidwastelandfill', 'grey', 'circle');
setLegendSymbol('floodplain', '#ADD8E6', 'polygon');
setLegendSymbol('remediationsites', 'red', 'polygon');
setLegendSymbol('avgIncome', {'$0 - $30,000': '#fee08b', '$30,000 - $60,000': '#fdae61', '$60,000 - $90,000': '#d73027', '$90,000 - $150,000': '#4575b4', '$150,000 - $250,000': '#313695'}, 'polygon', { layout: 'vertical'});






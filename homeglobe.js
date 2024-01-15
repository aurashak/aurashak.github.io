
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false
});

viewer.imageryLayers.get(0).brightness = 1.2;
viewer.imageryLayers.get(0).contrast = 1.2;

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
    }
});


viewer.camera.percentageChanged = 0.01; // Adjust this threshold as needed

function haversineDistance(lon1, lat1, lon2, lat2) {
  // Convert latitude and longitude from degrees to radians
  var lon1Rad = Cesium.Math.toRadians(lon1);
  var lat1Rad = Cesium.Math.toRadians(lat1);
  var lon2Rad = Cesium.Math.toRadians(lon2);
  var lat2Rad = Cesium.Math.toRadians(lat2);

  // Haversine formula
  var dlon = lon2Rad - lon1Rad;
  var dlat = lat2Rad - lat1Rad;
  var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
          Math.cos(lat1Rad) * Math.cos(lat2Rad) *
          Math.sin(dlon / 2) * Math.sin(dlon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Earth's radius in meters (change this value if needed)
  var radius = 6371000; // approximately 6371 km

  return radius * c;
}


// Function to rotate the globe slowly
function rotateGlobe() {
    if (isRotating) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
    }
}

// Slow down the rotation
var spinRate = 0.0003;
var isRotating = true; // To keep track of the rotation state

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

var defaultText = 'Latitude: Longitude: <br>Continent:<br>Country<br>State/Province:<br>Lake ';
var coordsBox = document.getElementById('coordsBox');
coordsBox.innerHTML = defaultText;
coordsBox.style.display = 'block';

// Define variables to keep track of layer visibility
var osmLayerVisible = true; // OpenStreetMap
var sentinelLayerVisible = true; // Sentinel-2

// Function to toggle OpenStreetMap layer
function toggleOSMLayer() {
    osmLayerVisible = !osmLayerVisible;
    viewer.imageryLayers.get(0).show = osmLayerVisible;
}

// Function to toggle Sentinel-2 layer
function toggleSentinelLayer() {
    sentinelLayerVisible = !sentinelLayerVisible;
    // Replace 'Sentinel-2' with the name of the layer you want to toggle (if it's not the first layer)
    viewer.imageryLayers.get(1).show = sentinelLayerVisible;
}


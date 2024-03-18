// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZWYwNWEzNi0zMThkLTQ5ZjgtODZmNC01ZWI0ODQ1OWVhYTYiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDY3MjIxNjN9.JZdCe1eGQfsow46cZGVVG1r8hL1L0E72AzUsFs1Rw8s";

// Initialize Cesium
const initializeCesium = async () => {
  // Create a Cesium viewer
  const viewer = new Cesium.Viewer("cesiumContainer", {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: true,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false,
  });

  var boundingBox = new Cesium.Rectangle(
    Cesium.Math.toRadians(-74.05), // West
    Cesium.Math.toRadians(40.5),   // South
    Cesium.Math.toRadians(-73.75), // East
    Cesium.Math.toRadians(40.9)    // North
  );
  
  // Set initial view
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-73.9666, 40.8200, 400),
    orientation: {
      heading: Cesium.Math.toRadians(65),
      pitch: Cesium.Math.toRadians(-40),
      roll: 0,
    },
  });
  
  // Create ScreenSpaceEventHandler
  var screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  
  // Store the initial camera position
  var initialCameraPosition = viewer.scene.camera.position.clone();
  
  // Add an event handler to limit the camera movement within the bounding box
  screenSpaceEventHandler.setInputAction(function (movement) {
    var pickRay = viewer.scene.camera.getPickRay(movement.endPosition);
    var pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene);
  
    if (pickPosition) {
      var cartographic = Cesium.Cartographic.fromCartesian(pickPosition);
      var longitude = cartographic.longitude;
      var latitude = cartographic.latitude;
  
      // Check if the new camera position is inside the bounding box
      if (
        longitude < boundingBox.west ||
        longitude > boundingBox.east ||
        latitude < boundingBox.south ||
        latitude > boundingBox.north
      ) {
        // If outside the bounding box, reset the camera to the initial position
        viewer.scene.camera.position = initialCameraPosition.clone();
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  

  




  


   // Set up an event listener for mouse movement
viewer.scene.canvas.addEventListener('mousemove', function (e) {
  // Get the mouse position
  var mousePosition = new Cesium.Cartesian2(e.clientX, e.clientY);

  // Use scene.pick to get the entity under the mouse cursor
  var pickedObject = viewer.scene.pick(mousePosition);

  // Check if an object is picked
  if (Cesium.defined(pickedObject)) {
    // Get information about the picked object (entity, primitive, etc.)
    var pickedEntity = pickedObject.id;

    // Display the information (customize as needed)
    if (Cesium.defined(pickedEntity)) {
      console.log('Picked Entity:', pickedEntity);

      // Log the coordinates of the picked entity
      var pickedEntityPosition = pickedEntity.position.getValue(viewer.clock.currentTime);
      console.log('Coordinates:', Cesium.Cartographic.fromCartesian(pickedEntityPosition));

      // Log additional properties of the picked entity
      console.log('Other properties:', pickedEntity.properties);

      // You can display information about the entity in a popup, tooltip, or any other UI element
    }
  } else {
    // No object picked, clear or hide the displayed information
    console.log('No object picked');
    // Clear or hide the information in your UI
  }
});






    
};

// Call the initializeCesium function
initializeCesium();






/*

   // Load nycsubway GeoJsonDataSource
const nycsubwayResource = await Cesium.IonResource.fromAssetId(2482445);
const nycsubwayDataSource = await Cesium.GeoJsonDataSource.load(nycsubwayResource);

// Define colors for each subway line based on the "name" column
const subwayLineColors = {
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

// Function to get the color based on the subway line name
function getSubwayLineColor(name) {
    return subwayLineColors[name] || 'white'; // Default color is white if not found in the mapping
}

// Modify the polyline color before adding the data source
nycsubwayDataSource.entities.values.forEach((entity) => {
    if (entity.polyline) {
        // Get the subway line name from the "name" property
        const subwayLineName = entity.properties.name;

        // Change the polyline color based on the subway line name
        entity.polyline.material = Cesium.Color.fromCssColorString(getSubwayLineColor(subwayLineName));
    }
});

// Create a switch event listener for nycsubway
const nycsubwaySwitch = document.getElementById("nycsubwaySwitch");

// Function to toggle the visibility of the nycsubwayDataSource
const toggleNycSubwayLayer = () => {
    const isChecked = nycsubwaySwitch.checked;
    nycsubwayDataSource.entities.values.forEach((entity) => {
        entity.show = isChecked;
    });
};

// Add an event listener to the switch
nycsubwaySwitch.addEventListener("change", toggleNycSubwayLayer);

// Set the switch's initial state
nycsubwaySwitch.checked = false;

// Initial load of nycsubway with the specified color
// (No need to add it to viewer initially, as the switch is in the 'off' position)
console.log("Initial load of nycsubwayDataSource");


*/





    /*

    // Load GeoJsonDataSource with asset ID 2483827
    const busDepotsResource = await Cesium.IonResource.fromAssetId(2483827);
    const busDepotsDataSource = await Cesium.GeoJsonDataSource.load(busDepotsResource);

    // Modify the billboard color and style before adding the data source
    busDepotsDataSource.entities.values.forEach((entity) => {
      if (entity.billboard) {
        // Change the billboard color to blue
        entity.billboard.color = Cesium.Color.BLUE;
        // Change the billboard style to your desired image
        entity.billboard.image = createCustomImage(); // Function to create a custom image
      }
    });

    // Create a switch event listener for the busdepots layer
    const busDepotsSwitch = document.getElementById("busDepotsSwitch");

    // Set the switch to the off position initially
    busDepotsSwitch.checked = false;

    busDepotsSwitch.addEventListener("change", (event) => {
      if (event.target.checked) {
        viewer.dataSources.add(busDepotsDataSource);
        console.log("busDepotsDataSource added to viewer");
      } else {
        viewer.dataSources.remove(busDepotsDataSource);
        console.log("busDepotsDataSource removed from viewer");
      }
    });

    // Initial load of the busdepots layer with modified billboards
    if (busDepotsSwitch.checked) {
      viewer.dataSources.add(busDepotsDataSource);
      console.log("Initial load of busDepotsDataSource");
    }

    // Function to create a custom image
    function createCustomImage() {
      const canvas = document.createElement("canvas");
      canvas.width = 20;
      canvas.height = 20;
      const context = canvas.getContext("2d");
      // Customize the image as needed
      context.fillStyle = "blue";
      context.fillRect(0, 0, canvas.width, canvas.height);
      return canvas;
    }

    */


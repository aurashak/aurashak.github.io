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





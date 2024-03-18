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










    // Load full google photorealistic tileset
    const newTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
    viewer.scene.primitives.add(newTileset);
    newTileset.show = true; // Set the initial state to 'on'

    // Apply default style to the tileset if available
    const newExtras = newTileset.asset.extras;
    if (
      Cesium.defined(newExtras) &&
      Cesium.defined(newExtras.ion) &&
      Cesium.defined(newExtras.ion.defaultStyle)
    ) {
      newTileset.style = new Cesium.Cesium3DTileStyle(newExtras.ion.defaultStyle);
    }

    // Remove the default satellite imagery layers
    viewer.imageryLayers.removeAll();

    // Create a switch event listener for the new 3D Tileset
    const newTilesetSwitch = document.getElementById("3dTileSwitch");
    newTilesetSwitch.checked = true; // Set the initial state to 'on'

    newTilesetSwitch.addEventListener("change", (event) => {
      newTileset.show = event.target.checked;
      const status = event.target.checked ? "shown" : "hidden";
      console.log(`3D Tileset Layer ${status}`);
    });

    console.log("Initial load of 3D Tileset layer with the switch turned on.");







// Load OSM buildings 3D Tileset
const osmBuildingsTileset = viewer.scene.primitives.add(
  await Cesium.Cesium3DTileset.fromIonAssetId(96188)
);

// Apply default style to the OSM buildings tileset if available
const osmExtras = osmBuildingsTileset.asset.extras;
if (
  Cesium.defined(osmExtras) &&
  Cesium.defined(osmExtras.ion) &&
  Cesium.defined(osmExtras.ion.defaultStyle)
) {
  osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle(
    osmExtras.ion.defaultStyle
  );
}

// Create a switch event listener for the OSM buildings Tileset
const osmBuildingsSwitch = document.getElementById("osmBuildingsSwitch");

// Set the switch to the off position initially
osmBuildingsSwitch.checked = false;

osmBuildingsSwitch.addEventListener("change", (event) => {
  osmBuildingsTileset.show = event.target.checked;
});

// Hide the OSM buildings Tileset initially
osmBuildingsTileset.show = false;










// Set the OSM Maps switch to the off position initially
const osmMapsSwitch = document.getElementById("osmMapsSwitch");
osmMapsSwitch.checked = false;

// Initialize the Cesium OpenStreetMap layer but don't add it to the viewer yet
const osmLayer = new Cesium.UrlTemplateImageryProvider({
  url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
});
osmLayer.name = "OpenStreetMap"; // Set the name of the layer
osmLayer.order = 1; // Set a higher order value to ensure it's above other layers
console.log("OpenStreetMap layer initialized, but not added to viewer");

// Function to add or remove the OpenStreetMap layer based on switch state
function toggleOSMMapLayer() {
  if (osmMapsSwitch.checked) {
    // Add the OpenStreetMap layer to the viewer when the switch is turned on
    viewer.imageryLayers.addImageryProvider(osmLayer);
    console.log("OpenStreetMap layer added to viewer");
  } else {
    // Remove the OpenStreetMap layer from the viewer when the switch is turned off
    viewer.imageryLayers.remove(osmLayer);
    console.log("OpenStreetMap layer removed from viewer");
  }
}

// Create a switch event listener for the OSM Maps layer
osmMapsSwitch.addEventListener("change", () => {
  console.log("Switch state changed:", osmMapsSwitch.checked);
  toggleOSMMapLayer();
});

// Call the function to set the initial state of the OpenStreetMap layer
toggleOSMMapLayer();




    // Load mtscso GeoJsonDataSource
    const mtscsoResource = await Cesium.IonResource.fromAssetId(2460335);
    const mtscsoDataSource = await Cesium.GeoJsonDataSource.load(mtscsoResource);

    // Modify the billboard color and style before adding the data source
    mtscsoDataSource.entities.values.forEach((entity) => {
      if (entity.billboard) {
        // Change the billboard color to red
        entity.billboard.color = Cesium.Color.RED;

        // Change the billboard style to Circle using the createCircleImage function
        entity.billboard.image = createCircleImage();
      }
    });

    // Create a switch event listener for mtscso
    const mtscsoSwitch = document.getElementById("mtscsoSwitch");

    // Set the switch to the off position initially
    mtscsoSwitch.checked = false;

    mtscsoSwitch.addEventListener("change", (event) => {
      if (event.target.checked) {
        viewer.dataSources.add(mtscsoDataSource);
        console.log("mtscsoDataSource added to viewer");
      } else {
        viewer.dataSources.remove(mtscsoDataSource);
        console.log("mtscsoDataSource removed from viewer");
      }
    });

    // Function to create a red circle image
    function createCircleImage() {
      const canvas = document.createElement("canvas");
      canvas.width = 15;
      canvas.height = 15;
      const context = canvas.getContext("2d");
      context.beginPath();
      context.arc(10, 10, 8, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
      return canvas;
    }







    // Load mtsparks GeoJsonDataSource
    const mtsparksResource = await Cesium.IonResource.fromAssetId(2482444);
    const mtsparksDataSource = await Cesium.GeoJsonDataSource.load(mtsparksResource);

    // Modify the polyline/polygon color and disable the outline before adding the data source
    mtsparksDataSource.entities.values.forEach((entity) => {
      if (entity.polygon) {
        // Change the polygon color to green
        entity.polygon.material = Cesium.Color.GREEN;

        // Disable the polygon outline
        entity.polygon.outline = false;
      }
    });

    // Create a switch event listener for mtsparks
    const mtsparksSwitch = document.getElementById("mtsparksSwitch");

    // Set the switch to the off position initially
    mtsparksSwitch.checked = false;

    mtsparksSwitch.addEventListener("change", (event) => {
      mtsparksDataSource.entities.values.forEach((entity) => {
        entity.show = event.target.checked;
      });
    });

    // Initial load of mtsparks with the green color and disabled outline
    viewer.dataSources.add(mtsparksDataSource);
    mtsparksDataSource.entities.values.forEach((entity) => {
      entity.show = false; // Make sure entities are hidden by default
    });




    async function loadMTSRailDataSource(viewer) {
      // Load mtsrail GeoJsonDataSource
      const mtsrailResource = await Cesium.IonResource.fromAssetId(2482267);
      const mtsrailDataSource = await Cesium.GeoJsonDataSource.load(mtsrailResource);
  
      // Modify the polyline color and height before adding the data source
      mtsrailDataSource.entities.values.forEach((entity) => {
          if (entity.polyline) {
              // Change the polyline color to pink
              entity.polyline.material = Cesium.Color.RED;
  
              // Adjust the height of each position in the polyline
              const positions = entity.polyline.positions.getValue(Cesium.JulianDate.now());
              const newPositions = positions.map(position => {
                  return new Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, 20); // Adjust the height here
              });
              entity.polyline.positions = newPositions;
          }
      });
  
      // Create a switch event listener for mtsrail
      const mtsrailSwitch = document.getElementById("mtsrailSwitch");
  
      // Set the switch to the off position initially
      mtsrailSwitch.checked = false;
  
      mtsrailSwitch.addEventListener("change", (event) => {
          mtsrailDataSource.entities.values.forEach((entity) => {
              entity.show = event.target.checked;
          });
      });
  
      // Initial load of mtsrail with the pink color and adjusted height
      viewer.dataSources.add(mtsrailDataSource);
      mtsrailDataSource.entities.values.forEach((entity) => {
          entity.show = false; // Make sure entities are hidden by default
      });
  }
  
  // Call the function to load the MTSRail data source
  loadMTSRailDataSource(viewer);
  









    // Load mtsgas GeoJsonDataSource
    const mtsgasResource = await Cesium.IonResource.fromAssetId(2482499);
    const mtsgasDataSource = await Cesium.GeoJsonDataSource.load(mtsgasResource);

    // Modify the polyline color and width before adding the data source
    mtsgasDataSource.entities.values.forEach((entity) => {
      if (entity.polyline) {
        // Change the polyline color to black
        entity.polyline.material = Cesium.Color.BLACK;

        // Change the polyline width
        entity.polyline.width = 3; // Adjust the width as needed
      }
    });

    // Create a switch event listener for mtsgas
    const mtsgasSwitch = document.getElementById("mtsgasSwitch");
    mtsgasSwitch.addEventListener("change", (event) => {
      if (event.target.checked) {
        viewer.dataSources.add(mtsgasDataSource);
        console.log("mtsgasDataSource added to viewer");
      } else {
        viewer.dataSources.remove(mtsgasDataSource);
        console.log("mtsgasDataSource removed from viewer");
      }
    });

    // Set the initial state of the switch to 'off'
    mtsgasSwitch.checked = false;

    // Trigger the 'change' event to ensure the initial state is applied
    const initialChangeEvent = new Event("change");
    mtsgasSwitch.dispatchEvent(initialChangeEvent);



    // Load electriclines GeoJsonDataSource
const electriclinesResource = await Cesium.IonResource.fromAssetId(2485569);
const electriclinesDataSource = await Cesium.GeoJsonDataSource.load(electriclinesResource);

// Modify the polyline color and width before adding the data source
electriclinesDataSource.entities.values.forEach((entity) => {
  if (entity.polyline) {
    // Change the polyline color to your desired color
    entity.polyline.material = Cesium.Color.YELLOW; // Change to the color you want
    // Change the polyline width
    entity.polyline.width = 3; // Adjust the width as needed
  }
});

// Create a switch event listener for electriclines
const electriclinesSwitch = document.getElementById("electriclinesSwitch");
electriclinesSwitch.addEventListener("change", (event) => {
  if (event.target.checked) {
    viewer.dataSources.add(electriclinesDataSource);
    console.log("electriclinesDataSource added to viewer");
  } else {
    viewer.dataSources.remove(electriclinesDataSource);
    console.log("electriclinesDataSource removed from viewer");
  }
});

// Set the initial state of the switch to 'off'
electriclinesSwitch.checked = false;

// Trigger the 'change' event to ensure the initial state is applied
const initialChangeEventElectriclines = new Event("change");
electriclinesSwitch.dispatchEvent(initialChangeEventElectriclines);





    // Create a switch event listener for mtsstreets
    const mtsstreetsSwitch = document.getElementById("mtsstreetsSwitch");

    // Set the switch to the off position initially
    mtsstreetsSwitch.checked = false;

    // Function to handle loading or unloading mtsstreetsDataSource
    const toggleMtsstreetsLayer = async () => {
      if (mtsstreetsSwitch.checked) {
        // Load mtsstreets GeoJsonDataSource
        const mtsstreetsResource = await Cesium.IonResource.fromAssetId(2477200);
        const mtsstreetsDataSource = await Cesium.GeoJsonDataSource.load(mtsstreetsResource);

        // Modify the polyline color before adding the data source
        mtsstreetsDataSource.entities.values.forEach((entity) => {
          if (entity.polyline) {
            // Change the polyline color to red
            entity.polyline.material = Cesium.Color.GREY;
          }
        });

        // Add the loaded mtsstreetsDataSource to the viewer
        viewer.dataSources.add(mtsstreetsDataSource);
        console.log("mtsstreetsDataSource added to viewer");
      } else {
        // If the switch is turned off, remove the mtsstreetsDataSource from the viewer
        viewer.dataSources.remove(mtsstreetsDataSource);
        console.log("mtsstreetsDataSource removed from viewer");
      }
    };

    // Add the event listener to the switch
    mtsstreetsSwitch.addEventListener("change", toggleMtsstreetsLayer);












    
};

// Call the initializeCesium function
initializeCesium();





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



// Define the flyToPlanView function
function flyToPlanView() {
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      -73.9625,
      40.8217,
      1000 // Adjust the zoom level as needed
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0), // Set heading to north
      pitch: Cesium.Math.toRadians(-90), // Look straight down
      roll: 0,
    },
  });
}

// Add a click event listener to the flyToPlanView button
const flyToPlanViewBtn = document.getElementById('flyToPlanView');
flyToPlanViewBtn.addEventListener('click', flyToPlanView);




  // Define the flyToMTSCity function
  function flyToMTS() {
    // Fly back to New York City
    viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        -73.9625,
        40.8217,
        200 // Adjust the zoom level as needed
      ),
      orientation: {
        heading: Cesium.Math.toRadians(65), // clockwise from north
        pitch: Cesium.Math.toRadians(-40), // Look downward
        roll: 0,
      },
    });
  }


 // Add a click event listener to the flyToMTS button
  const flyToMTSButton = document.getElementById('flyToMTS');
  flyToMTSButton.addEventListener('click', flyToMTS);






    // Define the flyToWasteWater function
    function flyToWasteWater() {
      // Fly back to New York City
      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          -73.9628,
          40.8232,
          200 // Adjust the zoom level as needed
        ),
        orientation: {
          heading: Cesium.Math.toRadians(65), // clockwise from north
          pitch: Cesium.Math.toRadians(-40), // Look downward
          roll: 0,
        },
      });
    }
  
   // Add a click event listener to the flyToNewYorkCity button
    const flyToWasteWaterButton = document.getElementById('flyToWasteWater');
    flyToWasteWaterButton.addEventListener('click', flyToWasteWater);




    
      // Define the flyToBusDepotCity function
  function flyToBusDepot() {
    // Fly back to New York City
    viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        -73.9620,
        40.8154,
        300 // Adjust the zoom level as needed
      ),
      orientation: {
        heading: Cesium.Math.toRadians(65), // clockwise from north
        pitch: Cesium.Math.toRadians(-40), // Look downward
        roll: 0,
      },
    });
  }

 // Add a click event listener to the flyToNewYorkCity button
  const flyToBusDepotButton = document.getElementById('flyToBusDepot');
  flyToBusDepotButton.addEventListener('click', flyToBusDepot);




        // Define the flyToGasPipeline function
        function flyToGasPipeline() {
          // Fly back to New York City
          viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
              -73.9623,
              40.8207,
              70 // Adjust the zoom level as needed
            ),
            orientation: {
              heading: Cesium.Math.toRadians(65), // clockwise from north
              pitch: Cesium.Math.toRadians(-40), // Look downward
              roll: 0,
            },
          });
        }
      
       // Add a click event listener to the flyToGasPipeline button
        const flyToGasPipelineButton = document.getElementById('flyToGasPipeline');
        flyToGasPipelineButton.addEventListener('click', flyToGasPipeline);



                // Define the flyToOverview function
                function flyToOverview() {
                  // Fly back to New York City
                  viewer.scene.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(
                      -73.9710,
                      40.8192,
                      500 // Adjust the zoom level as needed
                    ),
                    orientation: {
                      heading: Cesium.Math.toRadians(65), // clockwise from north
                      pitch: Cesium.Math.toRadians(-40), // Look downward
                      roll: 0,
                    },
                  });
                }
              
               // Add a click event listener to the flyToOverview button
                const flyToOverviewButton = document.getElementById('flyToOverview');
                flyToOverviewButton.addEventListener('click', flyToOverview);
        
        

                




    // minimum and maximum zoom limits
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 70000;

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





/*

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

    
*/


// Load OSM buildings MTS Building
const osmBuildingsTileset = await Cesium.Cesium3DTileset.fromIonAssetId(96188);

// Add the tileset to the viewer's scene
viewer.scene.primitives.add(osmBuildingsTileset);

// Function to show only the buildings with the given element IDs after the tileset is fully loaded
function showBuildings() {
  // Show building with ID 275080379 in red and add label
  showBuildingById(osmBuildingsTileset, 275080379, "red");
}

// Listen for the tileLoad event to ensure all tiles are loaded
osmBuildingsTileset.tileLoad.addEventListener(showBuildings);

// Function to show only the building with the given element ID for the tileset
function showBuildingById(tileset, elementId, color) {
  console.log("Showing building with ID", elementId);
  tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${elementId} === " + elementId, `rgba(${color === "red" ? "255, 0, 0" : (color === "blue" ? "0, 0, 255" : "0, 255, 0")}, 0.7)`], // Show the specific building with the given ID, set color accordingly
        [true, "rgba(255, 255, 255, 0)"] // Hide other buildings
      ]
    }
  });

  // Add green box at the same location with rotation along the Y-axis
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-73.9593, 40.8226, -10), // Same position as the label
    box: {
      dimensions: new Cesium.Cartesian3(50, 50, 50), // Adjust dimensions as needed
      material: Cesium.Color.GREEN.withAlpha(0.3), // Green color with transparency
    },
    label: {
      text: "Marine Transfer Station",
      font: "14px Arial",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -50)
    }
  });

  // Add second green box next to the first one with rotation along the Y-axis
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-73.957182, 40.825354, -10), // Adjusted position to be next to the first box
    box: {
      dimensions: new Cesium.Cartesian3(400, 50, 50), // Adjust dimensions as needed (long rectangle)
      material: Cesium.Color.GREEN.withAlpha(0.3), // Green color with transparency
    },
    label: {
      text: "North River Sewage Treatment Plant",
      font: "14px Arial",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // Pin the label to a certain height
      pixelOffset: new Cesium.Cartesian2(0, -50) // Adjust as needed to set the label's height
    }
  });

  // Add third green box next to the first one with rotation along the Y-axis
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-73.95924846693057, 40.82136519651025, -10), // Adjusted position to be next to the first box
    box: {
      dimensions: new Cesium.Cartesian3(30, 50, 30), // Adjust dimensions as needed (long rectangle)
      material: Cesium.Color.GREEN.withAlpha(0.3), // Green color with transparency
    },
    label: {
      text: "Williams Pipeline",
      font: "14px Arial",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // Pin the label to a certain height
      pixelOffset: new Cesium.Cartesian2(0, -30) // Adjust as needed to set the label's height
    }
  });




  // Add fourth green box next to the first one with rotation along the Y-axis
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-73.95790713393994, 40.81928006545158, -10), // Adjusted position to be next to the first box
  box: {
    dimensions: new Cesium.Cartesian3(100, 50, 80), // Adjust dimensions as needed (long rectangle)
    material: Cesium.Color.GREEN.withAlpha(0.3), // Green color with transparency
    orientation: Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Y, Cesium.Math.toRadians(30)) // Rotate around the Y-axis by 30 degrees
  },
  label: {
    text: "NYC Bus Depot",
    font: "14px Arial",
    fillColor: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // Pin the label to a certain height
    pixelOffset: new Cesium.Cartesian2(0, -30) // Adjust as needed to set the label's height
  }
});

// Log a message specifically for the NYC Bus Depot
console.log("Added NYC Bus Depot building");
}




// Calculate the rotation angle
const rotationAngle = Cesium.Math.toRadians(90);
console.log('Rotation Angle:', rotationAngle); // Log the rotation angle
const orientationQuaternion = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Y, rotationAngle);

// Log the orientation quaternion
console.log('Orientation Quaternion:', orientationQuaternion);

// Add fourth green box next to the first one with rotation along the Y-axis
viewer.entities.add({
    box: {
        dimensions: new Cesium.Cartesian3(100, 50, 80), // Adjust dimensions as needed (long rectangle)
        material: Cesium.Color.GREEN.withAlpha(0.3), // Green color with transparency
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -73.95790713393994, 40.11928006545158, -10,
            -73.95790713393994, 40.41928006545158 + 0.001, -10,
            -73.35790713393994 + 0.001, 40.01928006545158 + 0.001, -10,
            -73.95790713393994 + 0.001, 40.81928006545158, -10
        ]),
        orientation: orientationQuaternion // Apply rotation along the Y-axis
    },
    label: {
        text: "NYC Bus Depot",
        font: "14px Arial",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // Pin the label to a certain height
        pixelOffset: new Cesium.Cartesian2(0, -30) // Adjust as needed to set the label's height
    }
});

// Log a message specifically for the NYC Bus Depot
console.log("Added NYC Bus Depot building");







/* 

// Function to toggle NYCHA switch and layer visibility
function toggleNYCHASwitch() {
  console.log("NYCHA switch toggled.");
  const NYCHASwitch = document.getElementById("NYCHASwitch");
  const buildingIds = ["271893767", "271911034", "271911019", "271911412", "271911417", "271911419"];
  const show = NYCHASwitch.checked;

  console.log("NYCHA switch state:", show);
  console.log("Showing buildings with IDs", buildingIds);
  toggleBuildingVisibility(buildingIds, "rgba(0, 0, 255, 1)", show); // Blue color for NYCHA
  osmBuildingsTileset.show = show;
}

const NYCHASwitch = document.getElementById("NYCHASwitch");
NYCHASwitch.addEventListener("change", toggleNYCHASwitch);

*/




    
   
   /*
// Set the switch to the off position initially
const bingMapsSwitch = document.getElementById("bingMapsSwitch");
bingMapsSwitch.checked = false;

// Initialize the Cesium Bing Maps layer but don't add it to the viewer yet
const bingMapsLayer = await Cesium.IonImageryProvider.fromAssetId(4);
bingMapsLayer.name = "Bing Maps"; // Set the name of the layer
bingMapsLayer.order = 1; // Set a higher order value to ensure it's above other layers
console.log("Bing Maps layer initialized, but not added to viewer");

// Create a switch event listener for the Bing Maps layer
bingMapsSwitch.addEventListener("change", (event) => {
  // Check the switch state directly within the event listener
  if (event.target.checked) {
    // Add the layer to the viewer when the switch is turned on
    viewer.imageryLayers.addImageryProvider(bingMapsLayer);
    console.log("Bing Maps layer added to viewer");
  } else {
    // Remove the layer from the viewer when the switch is turned off
    viewer.imageryLayers.remove(bingMapsLayer);
    console.log("Bing Maps layer removed from viewer");
  }
});

*/




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


// Load whejsites GeoJsonDataSource
const whejsitesResource = await Cesium.IonResource.fromAssetId(2486537);
const whejsitesDataSource = await Cesium.GeoJsonDataSource.load(whejsitesResource);

// Modify the billboard color and style before adding the data source
whejsitesDataSource.entities.values.forEach((entity) => {
    if (entity.billboard) {
        // Change the billboard color to orange
        entity.billboard.color = Cesium.Color.ORANGE;

        // Change the billboard style to Circle using the createCircleImage function
        entity.billboard.image = createCircleImage();
    }
});

// Create a switch event listener for whejsites
const whejsitesSwitch = document.getElementById("whejsites");

// Set the switch to the off position initially
whejsitesSwitch.checked = false;

whejsitesSwitch.addEventListener("change", (event) => {
    if (event.target.checked) {
        viewer.dataSources.add(whejsitesDataSource);
        console.log("whejsites layer added to viewer");
    } else {
        viewer.dataSources.remove(whejsitesDataSource);
        console.log("whejsites layer removed from viewer");
    }
});

// Function to create an orange circle image
function createCircleImage() {
    const canvas = document.createElement("canvas");
    canvas.width = 15;
    canvas.height = 15;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.arc(10, 10, 8, 0, 2 * Math.PI);
    context.fillStyle = "orange";
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

    // Load mtsrail GeoJsonDataSource
    const mtsrailResource = await Cesium.IonResource.fromAssetId(2482267);
    const mtsrailDataSource = await Cesium.GeoJsonDataSource.load(mtsrailResource);

    // Modify the polyline color before adding the data source
    mtsrailDataSource.entities.values.forEach((entity) => {
      if (entity.polyline) {
        // Change the polyline color to pink
        entity.polyline.material = Cesium.Color.RED;
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

    // Initial load of mtsrail with the pink color
    viewer.dataSources.add(mtsrailDataSource);
    mtsrailDataSource.entities.values.forEach((entity) => {
      entity.show = false; // Make sure entities are hidden by default
    });



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






// Load nycsubway GeoJsonDataSource
async function loadNycSubwayData() {
    try {
        const nycsubwayLinesResource = await Cesium.IonResource.fromUrl('https://aurashak.github.io/geojson/nyc/nycsubway.geojson');
        const nycsubwayLinesDataSource = await Cesium.GeoJsonDataSource.load(nycsubwayLinesResource);

        // Create a switch event listener for nycsubway
        const nycsubwayLinesSwitch = document.getElementById("nycsubwayLinesSwitch");

        // Function to toggle the visibility of the nycsubwayLinesDataSource
        const toggleNycSubwayLinesLayer = () => {
            const isChecked = nycsubwayLinesSwitch.checked;
            nycsubwayLinesDataSource.entities.values.forEach((entity) => {
                entity.show = isChecked;
            });
        };

        // Add an event listener to the switch
        nycsubwayLinesSwitch.addEventListener("change", toggleNycSubwayLinesLayer);

        // Set the switch's initial state
        nycsubwayLinesSwitch.checked = false;

        // Add nycsubwayLinesDataSource to the viewer initially with visibility off
        viewer.dataSources.add(nycsubwayLinesDataSource);
        toggleNycSubwayLinesLayer(); // Ensure visibility state matches the switch

        console.log("GeoJSON data source loaded successfully");
    } catch (error) {
        console.error("Error loading GeoJSON data source:", error);
    }
}

// Call the function to load NYC subway data
loadNycSubwayData();





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
        const mtsstreetsResource = await Cesium.IonResource.fromAssetId(2484939);
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
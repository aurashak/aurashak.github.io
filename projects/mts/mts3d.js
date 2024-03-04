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
    navigationHelpButton: true,
    fullscreenButton: false,
    animation: false,
  });

// Wait for the viewer to be ready
viewer.scene.postRender.addEventListener(async function onPostRender() {
  viewer.scene.postRender.removeEventListener(onPostRender);

  // Fly to New York City initially
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      -73.9625,
      40.8217,
      400 // Adjust the zoom level as needed
    ),
    orientation: {
      heading: Cesium.Math.toRadians(65), // clockwise from north
      pitch: Cesium.Math.toRadians(-40), // Look downward
      roll: 0,
    },
  });

  // Define the flyToNewYorkCity function
  function flyToNewYorkCity() {
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

 // Add a click event listener to the flyToNewYorkCity button
  const flyToNewYorkCityButton = document.getElementById('flyToNewYorkCity');
  flyToNewYorkCityButton.addEventListener('click', flyToNewYorkCity);



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

    // Load nycsubway GeoJsonDataSource
const nycsubwayResource = await Cesium.IonResource.fromAssetId(2482445);
const nycsubwayDataSource = await Cesium.GeoJsonDataSource.load(nycsubwayResource);

// Modify the polyline color before adding the data source
nycsubwayDataSource.entities.values.forEach((entity) => {
    if (entity.polyline) {
        // Change the polyline color to your desired color (e.g., blue)
        entity.polyline.material = Cesium.Color.BLUE;
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
  });

};

// Call the initializeCesium function
initializeCesium();


  /*

  // Load nycboroughs GeoJsonDataSource
  const nycboroughsResource = await Cesium.IonResource.fromAssetId(2483910);
  const nycboroughsDataSource = await Cesium.GeoJsonDataSource.load(nycboroughsResource);

  // Set a white fill style for the nycboroughs layer and lower the height
  nycboroughsDataSource.entities.values.forEach((entity) => {
    if (entity.polygon) {
      entity.polygon.material = Cesium.Color.WHITE;
      entity.polygon.outline = false;
      entity.polygon.height = -50;
    }
  });

  // Initial load of nycboroughs layer
  viewer.dataSources.add(nycboroughsDataSource);

 */



/*

// Disable all input handling to prevent camera movement
viewer.scene.screenSpaceCameraController.enableTranslate = true;
viewer.scene.screenSpaceCameraController.enableRotate = true;
viewer.scene.screenSpaceCameraController.enableZoom = true;
viewer.scene.screenSpaceCameraController.enableTilt = true;
viewer.scene.screenSpaceCameraController.enableLook = true;

*/





  /* 

  // Set camera position
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.006, 40.712, 500), // Set the longitude, latitude, and altitude of the camera
    orientation: {
      heading: Cesium.Math.toRadians(0), // Heading in radians
      pitch: Cesium.Math.toRadians(-90), // Pitch in radians
      roll: 0, // Roll in radians
    },
  });


  // Set fixed scene mode
  viewer.scene.mode = Cesium.SceneMode.SCENE3D;

  // Disable terrain exaggeration if needed
  viewer.scene.terrainExaggeration = 1.0;



*/ 


/*

  // Load 3D Tileset of mts area segment
  const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2475248);
  viewer.scene.primitives.add(tileset);
  await viewer.zoomTo(tileset);

  // Apply default style to the tileset if available
  const extras = tileset.asset.extras;
  if (Cesium.defined(extras) && Cesium.defined(extras.ion) && Cesium.defined(extras.ion.defaultStyle)) {
    tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
  }

  // Remove the default satellite imagery layers
  viewer.imageryLayers.removeAll();

  // Create a switch event listener for the 3D Tileset
  const tilesetSwitch = document.getElementById("3dTileSwitch");
  tilesetSwitch.addEventListener("change", (event) => {
    tileset.show = event.target.checked;
  });

  */






/* 
// Load GeoJSON borough boundaries
const resource = await Cesium.IonResource.fromAssetId(2483910);
const dataSource = await Cesium.GeoJsonDataSource.load(resource);

// Modify the GeoJSON layer properties if needed
dataSource.entities.values.forEach((entity) => {
  if (entity.polygon) {
    // Change the polygon color to white
    entity.polygon.material = Cesium.Color.WHITE;

    // Lower the height of the entity to your desired value
    const currentHeight = entity.polygon.height.getValue();
    const loweredHeight = currentHeight - 500; // Set the lowered height in meters
    entity.polygon.height = loweredHeight;

    // You can also adjust other properties like `extrudedHeight` if needed
    // entity.polygon.extrudedHeight = loweredHeight;
  }
});

// Add the GeoJSON layer to the viewer beneath other layers
viewer.dataSources.add(dataSource);

// Initially hide the GeoJSON layer
dataSource.show = false;

*/



  
  /*
  
  // Function to load and toggle GeoJSON layers
  const loadGeoJSONLayer = async (assetId, labelText, switchId) => {
    try {
      // Load GeoJSON data
      const resource = await Cesium.IonResource.fromAssetId(assetId);
      const dataSource = await Cesium.GeoJsonDataSource.load(resource);
      viewer.dataSources.add(dataSource);

      // Create a switch for the GeoJSON layer
      const layerSwitch = document.createElement('input');
      layerSwitch.type = 'checkbox';
      layerSwitch.checked = true;
      layerSwitch.id = switchId;

      // Create a label for the switch
      const layerLabel = document.createElement('label');
      layerLabel.appendChild(layerSwitch);
      layerLabel.appendChild(document.createTextNode(labelText));

      // Create a container for the switch and label
      const layerSwitchContainer = document.createElement('div');
      layerSwitchContainer.classList.add('switch-container');
      layerSwitchContainer.appendChild(layerLabel);

      // Add the switch container to the page
      document.body.appendChild(layerSwitchContainer);

      // Event listener for the GeoJSON switch
      layerSwitch.addEventListener('change', async (event) => {
        await dataSource.when();
        dataSource.show = event.target.checked;
        console.log(`${labelText} GeoJSON switch:`, event.target.checked);
      });
    } catch (error) {
      console.error(`Error loading ${labelText} GeoJSON:`, error);
    }
  };

  // Load existing GeoJSON layers without switches
  loadGeoJSONLayer(2477557, 'mtsparks GeoJSON', 'mtsparksSwitch');
  loadGeoJSONLayer(2477597, 'mtscso GeoJSON', 'mtscsoSwitch');
  loadGeoJSONLayer(2477584, 'MTSGasPipelines GeoJSON', 'mtsgaspipelinesSwitch');
  loadGeoJSONLayer(2477618, 'mtsrail GeoJSON', 'mtsrailSwitch');

  // Load and toggle MTS Streets GeoJSON layer with switch
  loadGeoJSONLayer(2477200, 'MTS Streets GeoJSON', 'mtsStreetsSwitch');

  */
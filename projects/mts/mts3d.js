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
  await viewer.readyPromise;

  // Fly to New York City
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-73.9623, 40.8217, 400),
    orientation: {
      heading: Cesium.Math.toRadians(65), // clockwise from north
      pitch: Cesium.Math.toRadians(-40), // Look downward
      roll: 0,
    },
  });

  // Set minimum and maximum zoom limits
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 70000;

  


  // Load full google photorealistic tileset
  const newTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
  viewer.scene.primitives.add(newTileset);

  // Apply default style to the tileset if available
  const newExtras = newTileset.asset.extras;
  if (Cesium.defined(newExtras) && Cesium.defined(newExtras.ion) && Cesium.defined(newExtras.ion.defaultStyle)) {
    newTileset.style = new Cesium.Cesium3DTileStyle(newExtras.ion.defaultStyle);
  }

  // Remove the default satellite imagery layers
  viewer.imageryLayers.removeAll();

  // Create a switch event listener for the new 3D Tileset
  const newTilesetSwitch = document.getElementById("3dTileSwitch");
  newTilesetSwitch.addEventListener("change", (event) => {
    newTileset.show = event.target.checked;
  });


  

  // Add a layer of Bing Imagery from Cesium Ion
  const bingImageryLayer = viewer.imageryLayers.addImageryProvider(
    await Cesium.IonImageryProvider.fromAssetId(4, {
      credit: "Bing Maps Imagery",
    })
  );

  // Create a switch event listener for the Bing Imagery layer
  const bingLayerSwitch = document.getElementById("bingLayerSwitch");
  bingLayerSwitch.addEventListener("change", (event) => {
    bingImageryLayer.show = event.target.checked;
  });

  // Set the height for the Bing Imagery layer
  bingImageryLayer.height = 100;

  // Optionally, set the initial state of the switch
  bingLayerSwitch.checked = true; // or false, depending on your default visibility preference

  // Load OSM buildings 3D Tileset
  const osmBuildingsTileset = viewer.scene.primitives.add(
    await Cesium.Cesium3DTileset.fromIonAssetId(96188)
  );

  // Apply default style to the OSM buildings tileset if available
  const osmExtras = osmBuildingsTileset.asset.extras;
  if (Cesium.defined(osmExtras) && Cesium.defined(osmExtras.ion) && Cesium.defined(osmExtras.ion.defaultStyle)) {
    osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle(osmExtras.ion.defaultStyle);
  }

  // Create a switch event listener for the OSM buildings Tileset
  const osmBuildingsSwitch = document.getElementById("osmBuildingsSwitch");
  osmBuildingsSwitch.addEventListener("change", (event) => {
    osmBuildingsTileset.show = event.target.checked;
  });




  // Load GeoJsonDataSource mtscso
const mtscsoResource = await Cesium.IonResource.fromAssetId(2460335);
const mtscsoDataSource = await Cesium.GeoJsonDataSource.load(mtscsoResource);

// Modify individual circle markers in mtscso
mtscsoDataSource.entities.values.forEach((entity) => {
  if (entity.billboard) {
    // Change the billboard color to red
    entity.billboard.color = Cesium.Color.RED;
    // Change the billboard style to Circle
    entity.billboard.image = createCircleImage(); // Function to create a red circle image

    if (entity.position) {
      // Get the current position
      const currentPosition = entity.position.getValue(viewer.clock.currentTime);

      // Update the entity's position to the same longitude and latitude with a height offset of 100
      const newPosition = new Cesium.Cartesian3.fromDegrees(
        Cesium.Cartographic.fromCartesian(currentPosition).longitude,
        Cesium.Cartographic.fromCartesian(currentPosition).latitude,
        Cesium.Cartographic.fromCartesian(currentPosition).height + 100  // Add a height offset of 100
      );

      // Set the new position with height offset
      entity.position.setValue(newPosition);

      // Log the entity's position for debugging
      console.log("Entity Position:", newPosition);
    }
  }
});

// Create a switch event listener for mtscso
const mtscsoSwitch = document.getElementById("mtscsoSwitch");
mtscsoSwitch.addEventListener("change", (event) => {
  if (event.target.checked) {
    viewer.dataSources.add(mtscsoDataSource);
    console.log("mtscsoDataSource added to viewer");
  } else {
    viewer.dataSources.remove(mtscsoDataSource);
    console.log("mtscsoDataSource removed from viewer");
  }
});

// Initial load of mtscso with the red circle markers
viewer.dataSources.add(mtscsoDataSource);
console.log("Initial load of mtscsoDataSource");

// Function to create a red circle image
function createCircleImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 20;
  canvas.height = 20;
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
      entity.polygon.height = -40;
    }
  });

  // Create a switch event listener for mtsparks
  const mtsparksSwitch = document.getElementById("mtsparksSwitch");
  mtsparksSwitch.addEventListener("change", (event) => {
    mtsparksDataSource.entities.values.forEach((entity) => {
      entity.show = event.target.checked;
    });
  });

  // Initial load of mtsparks with the green color and disabled outline
  viewer.dataSources.add(mtsparksDataSource);
  mtsparksDataSource.entities.values.forEach((entity) => {
    entity.show = true; // Make sure entities are visible by default
  });

  console.log("Initial load of mtsparksDataSource");

  // Load mtsrail GeoJsonDataSource
  const mtsrailResource = await Cesium.IonResource.fromAssetId(2482267);
  const mtsrailDataSource = await Cesium.GeoJsonDataSource.load(mtsrailResource);

  // Modify the polyline color before adding the data source
  mtsrailDataSource.entities.values.forEach((entity) => {
    if (entity.polyline) {
      // Change the polyline color to pink
      entity.polyline.material = Cesium.Color.RED;
      entity.polyline.height = -40;
    }
  });

  // Create a switch event listener for mtsrail
  const mtsrailSwitch = document.getElementById("mtsrailSwitch");
  mtsrailSwitch.addEventListener("change", (event) => {
    mtsrailDataSource.entities.values.forEach((entity) => {
      entity.show = event.target.checked;
    });
  });

  // Initial load of mtsrail with the pink color
  viewer.dataSources.add(mtsrailDataSource);
  mtsrailDataSource.entities.values.forEach((entity) => {
    entity.show = true; // Make sure entities are visible by default
  });

  console.log("Initial load of mtsrailDataSource");

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
  viewer.dataSources.add(busDepotsDataSource);
  console.log("Initial load of busDepotsDataSource");

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
      entity.polyline.height = -40;
    }
  });

  // Create a switch event listener for nycsubway
  const nycsubwaySwitch = document.getElementById("nycsubwaySwitch");
  nycsubwaySwitch.addEventListener("change", (event) => {
    nycsubwayDataSource.entities.values.forEach((entity) => {
      entity.show = event.target.checked;
    });
  });

  // Initial load of nycsubway with the specified color
  viewer.dataSources.add(nycsubwayDataSource);
  nycsubwayDataSource.entities.values.forEach((entity) => {
    entity.show = true; // Make sure entities are visible by default
  });

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
      entity.polyline.height = -40;
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

  // Initial load of mtsgas with the black color and custom width
  viewer.dataSources.add(mtsgasDataSource);
  console.log("Initial load of mtsgasDataSource");

  // Load mtsstreets GeoJsonDataSource
  const mtsstreetsResource = await Cesium.IonResource.fromAssetId(2477125);
  const mtsstreetsDataSource = await Cesium.GeoJsonDataSource.load(mtsstreetsResource);

  // Modify the polyline color before adding the data source
  mtsstreetsDataSource.entities.values.forEach((entity) => {
    if (entity.polyline) {
      // Change the polyline color to red
      entity.polyline.material = Cesium.Color.GREY;
      entity.polyline.height = -40;
    }
  });

  // Create a switch event listener for mtsstreets
  const mtsstreetsSwitch = document.getElementById("mtsstreetsSwitch");
  mtsstreetsSwitch.addEventListener("change", (event) => {
    if (event.target.checked) {
      viewer.dataSources.add(mtsstreetsDataSource);
      console.log("mtsstreetsDataSource added to viewer");
    } else {
      viewer.dataSources.remove(mtsstreetsDataSource);
      console.log("mtsstreetsDataSource removed from viewer");
    }
  });

  // Initial load of mtsstreets with the red color
  viewer.dataSources.add(mtsstreetsDataSource);
  console.log("Initial load of mtsstreetsDataSource");
};

// Call the initializeCesium function
initializeCesium();





/*

// Disable all input handling to prevent camera movement
viewer.scene.screenSpaceCameraController.enableTranslate = true;
viewer.scene.screenSpaceCameraController.enableRotate = true;
viewer.scene.screenSpaceCameraController.enableZoom = true;
viewer.scene.screenSpaceCameraController.enableTilt = true;
viewer.scene.screenSpaceCameraController.enableLook = true;

*/



/*
  // Load nycboroughs GeoJsonDataSource
  const nycboroughsResource = await Cesium.IonResource.fromAssetId(2483910);
  const nycboroughsDataSource = await Cesium.GeoJsonDataSource.load(nycboroughsResource);

  // Set a white fill style for the nycboroughs layer and lower the height
  nycboroughsDataSource.entities.values.forEach((entity) => {
    if (entity.polygon) {
      entity.polygon.material = Cesium.Color.WHITE;
      entity.polygon.outline = false;
      entity.polygon.height = -30;
    }
  });

  // Initial load of nycboroughs layer
  viewer.dataSources.add(nycboroughsDataSource);

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
// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjAyN2RmMC05ZDQxLTQwM2YtOWZiZC1hMTI5ZDZlMDgyMGIiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDM4MzA3Njh9.5yn30zsnLQltPUj52_wu8sNHKKNeHkGVi267uKmzI3Q";

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
    skyBox: false,
    skyAtmosphere: false,
  });

  // Set camera position
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.006, 40.712, 500), // Set the longitude, latitude, and altitude of the camera
    orientation: {
      heading: Cesium.Math.toRadians(0), // Heading in radians
      pitch: Cesium.Math.toRadians(-90), // Pitch in radians
      roll: 0, // Roll in radians
    },
  });

  // Disable all input handling to prevent camera movement
  viewer.scene.screenSpaceCameraController.enableTranslate = false;
  viewer.scene.screenSpaceCameraController.enableRotate = false;
  viewer.scene.screenSpaceCameraController.enableZoom = true;
  viewer.scene.screenSpaceCameraController.enableTilt = true;
  viewer.scene.screenSpaceCameraController.enableLook = false;

  // Set fixed scene mode
  viewer.scene.mode = Cesium.SceneMode.SCENE3D;

  // Disable terrain exaggeration if needed
  viewer.scene.terrainExaggeration = 1.0;

  // Set minimum and maximum zoom limits (adjust as needed)
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100; // Minimum zoom distance in meters
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000; // Maximum zoom distance in meters




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


// Define the bounding box for West Harlem, NYC
const westHarlemBoundingBox = {
    west: -73.963,  // Minimum longitude
    south: 40.800,  // Minimum latitude
    east: -73.934,  // Maximum longitude
    north: 40.827,  // Maximum latitude
    height: 0,      // Height above the ellipsoid
  };
  
  // Load full google photorealistic tileset
  const newTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
  viewer.scene.primitives.add(newTileset);
  
  // Create a bounding sphere for West Harlem
  const boundingSphere = Cesium.BoundingSphere.fromRectangle3D(
    Cesium.Rectangle.fromDegrees(westHarlemBoundingBox.west, westHarlemBoundingBox.south, westHarlemBoundingBox.east, westHarlemBoundingBox.north),
    viewer.scene.globe.ellipsoid,
    westHarlemBoundingBox.height
  );
  
  // Set the custom bounding sphere for the area you want to focus on
  viewer.camera.viewBoundingSphere(boundingSphere);
  
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
  



  // Load OSM buildings 3D Tileset
const osmBuildingsTileset = viewer.scene.primitives.add(
    await Cesium.Cesium3DTileset.fromIonAssetId(96188),
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


// Load mtscso GeoJsonDataSource
const mtscsoResource = await Cesium.IonResource.fromAssetId(2477597);
const mtscsoDataSource = await Cesium.GeoJsonDataSource.load(mtscsoResource);

// Modify the billboard color and style before adding the data source
mtscsoDataSource.entities.values.forEach((entity) => {
  if (entity.billboard) {
    // Change the billboard color to red
    entity.billboard.color = Cesium.Color.RED;
    // Change the billboard style to Circle
    entity.billboard.image = createCircleImage(); // Function to create a red circle image
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
const mtsparksResource = await Cesium.IonResource.fromAssetId(2477557);
const mtsparksDataSource = await Cesium.GeoJsonDataSource.load(mtsparksResource);

// Modify the polyline/polygon color before adding the data source
mtsparksDataSource.entities.values.forEach((entity) => {
  if (entity.polyline) {
    // Change the polyline color to green
    entity.polyline.material = Cesium.Color.GREEN;
  } else if (entity.polygon) {
    // Change the polygon color to green
    entity.polygon.material = Cesium.Color.GREEN;
  }
});

// Create a switch event listener for mtsparks
const mtsparksSwitch = document.getElementById("mtsparksSwitch");
mtsparksSwitch.addEventListener("change", (event) => {
  mtsparksDataSource.entities.values.forEach((entity) => {
    entity.show = event.target.checked;
  });
});

// Initial load of mtsparks with the green color
viewer.dataSources.add(mtsparksDataSource);
mtsparksDataSource.entities.values.forEach((entity) => {
  entity.show = true; // Make sure entities are visible by default
});

console.log("Initial load of mtsparksDataSource");




// Load mtsrail GeoJsonDataSource
const mtsrailResource = await Cesium.IonResource.fromAssetId(2477618);
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





// Load mtsgas GeoJsonDataSource
const mtsgasResource = await Cesium.IonResource.fromAssetId(2477584);
const mtsgasDataSource = await Cesium.GeoJsonDataSource.load(mtsgasResource);

// Modify the polyline color and width before adding the data source
mtsgasDataSource.entities.values.forEach((entity) => {
  if (entity.polyline) {
    // Change the polyline color to black
    entity.polyline.material = Cesium.Color.BLACK;
    
    // Change the polyline width
    entity.polyline.width = 4; // Adjust the width as needed
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
const mtsstreetsResource = await Cesium.IonResource.fromAssetId(2477200);
const mtsstreetsDataSource = await Cesium.GeoJsonDataSource.load(mtsstreetsResource);

// Modify the polyline color before adding the data source
mtsstreetsDataSource.entities.values.forEach((entity) => {
  if (entity.polyline) {
    // Change the polyline color to red
    entity.polyline.material = Cesium.Color.GREY;
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
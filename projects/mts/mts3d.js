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


// Change the background color to black
viewer.scene.backgroundColor = Cesium.Color.BLACK;

// Set camera controller settings for limited bounds
viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000;




  // Load 3D Tileset
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

// Set the camera to the bounding volume of the tileset
const boundingVolume = tileset.boundingVolume.boundingVolume; // Get the bounding volume of the tileset
const boundingVolumeCartesian = Cesium.Matrix4.multiplyByPoint(
  tileset.modelMatrix,
  new Cesium.Cartesian3(
    (boundingVolume[0] + boundingVolume[3]) * 0.5,
    (boundingVolume[1] + boundingVolume[4]) * 0.5,
    (boundingVolume[2] + boundingVolume[5]) * 0.5
  ),
  new Cesium.Cartesian3()
);

viewer.camera.setView({
  destination: boundingVolumeCartesian,
  orientation: {
    heading: Cesium.Math.toRadians(0), // Set the desired heading
    pitch: Cesium.Math.toRadians(-90), // Look straight down
    roll: 0,
  },
  endTransform: Cesium.Matrix4.IDENTITY, // Reset any rotation
  complete: () => {
    // Do something after the camera has been set
  },
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

// Create a switch event listener for mtscso
const mtscsoSwitch = document.getElementById("mtscsoSwitch");
mtscsoSwitch.addEventListener("change", (event) => {
  if (event.target.checked) {
    viewer.dataSources.add(mtscsoDataSource);
  } else {
    viewer.dataSources.remove(mtscsoDataSource);
  }
});

// Initial load of mtscso
viewer.dataSources.add(mtscsoDataSource);



// Load mtsparks GeoJsonDataSource
const mtsparksResource = await Cesium.IonResource.fromAssetId(2477557);
const mtsparksDataSource = await Cesium.GeoJsonDataSource.load(mtsparksResource);

// Create a switch event listener for mtsparks
const mtsparksSwitch = document.getElementById("mtsparksSwitch");
mtsparksSwitch.addEventListener("change", (event) => {
  mtsparksDataSource.entities.values.forEach((entity) => {
    entity.show = event.target.checked;
  });
});

// Initial load of mtsparks
viewer.dataSources.add(mtsparksDataSource);
mtsparksDataSource.entities.values.forEach((entity) => {
  entity.show = true; // Make sure entities are visible by default
});

// Load mtsrail GeoJsonDataSource
const mtsrailResource = await Cesium.IonResource.fromAssetId(2477618);
const mtsrailDataSource = await Cesium.GeoJsonDataSource.load(mtsrailResource);

// Create a switch event listener for mtsrail
const mtsrailSwitch = document.getElementById("mtsrailSwitch");
mtsrailSwitch.addEventListener("change", (event) => {
  mtsrailDataSource.entities.values.forEach((entity) => {
    entity.show = event.target.checked;
  });
});

// Initial load of mtsrail
viewer.dataSources.add(mtsrailDataSource);
mtsrailDataSource.entities.values.forEach((entity) => {
  entity.show = true; // Make sure entities are visible by default
});




// Load mtscso GeoJsonDataSource
const mtsgasResource = await Cesium.IonResource.fromAssetId(2477584);
const mtsgasDataSource = await Cesium.GeoJsonDataSource.load(mtsgasResource);

// Create a switch event listener for mtscso
const mtsgasSwitch = document.getElementById("mtsgasSwitch");
mtsgasSwitch.addEventListener("change", (event) => {
  if (event.target.checked) {
    viewer.dataSources.add(mtsgasDataSource);
  } else {
    viewer.dataSources.remove(mtsgasDataSource);
  }
});

// Initial load of mtscso
viewer.dataSources.add(mtsgasDataSource);





  // Load mtsstreets GeoJsonDataSource
  const mtsstreetsResource = await Cesium.IonResource.fromAssetId(2477200);
  const mtsstreetsDataSource = await Cesium.GeoJsonDataSource.load(mtsstreetsResource);

  // Create a switch event listener for mtsstreets
  const mtsstreetsSwitch = document.getElementById("mtsstreetsSwitch");
  mtsstreetsSwitch.addEventListener("change", (event) => {
    if (event.target.checked) {
      viewer.dataSources.add(mtsstreetsDataSource);
    } else {
      viewer.dataSources.remove(mtsstreetsDataSource);
    }
  });

  // Initial load of mtsstreets
  viewer.dataSources.add(mtsstreetsDataSource);
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
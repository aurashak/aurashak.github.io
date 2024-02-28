// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjAyN2RmMC05ZDQxLTQwM2YtOWZiZC1hMTI5ZDZlMDgyMGIiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDM4MzA3Njh9.5yn30zsnLQltPUj52_wu8sNHKKNeHkGVi267uKmzI3Q";

// Initialize Cesium
const initializeCesium = async () => {
  // Create a Cesium viewer
  const viewer = new Cesium.Viewer('cesiumContainer', {
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
    backgroundColor: Cesium.Color.WHITE
  });

  // Set camera controller settings
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

  // Create a switch for the 3D Tileset
  const tilesetSwitch = document.getElementById('3dTileSwitch');
  tilesetSwitch.addEventListener('change', (event) => {
    tileset.show = event.target.checked;
  });

  // Create a switch for the mtsstreets layer
  const mtsstreetsSwitch = document.createElement('input');
  mtsstreetsSwitch.type = 'checkbox';
  mtsstreetsSwitch.id = 'mtsstreetsSwitch';
  mtsstreetsSwitch.checked = true; // Default to checked
  const mtsstreetsLabel = document.createElement('label');
  mtsstreetsLabel.innerHTML = 'mtsstreets';
  mtsstreetsLabel.appendChild(mtsstreetsSwitch);

  // Append the switch to a container element
  const switchContainer = document.getElementById('switchContainer');
  switchContainer.appendChild(mtsstreetsLabel);

  // Load mtsstreets GeoJsonDataSource
  const mtsstreetsResource = await Cesium.IonResource.fromAssetId(2477200);
  const mtsstreetsDataSource = await Cesium.GeoJsonDataSource.load(mtsstreetsResource);

  // Create a switch event listener for mtsstreets
  mtsstreetsSwitch.addEventListener('change', (event) => {
    if (event.target.checked) {
      viewer.dataSources.add(mtsstreetsDataSource);
    } else {
      viewer.dataSources.remove(mtsstreetsDataSource);
    }
  });
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
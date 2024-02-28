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
  const tilesetSwitch = createSwitch('3dTileSwitch', '3D Tileset', viewer, tileset);
  document.body.appendChild(tilesetSwitch.container);

  // Function to create a switch for GeoJSON layers
  const createGeoJSONSwitch = async (assetId, labelText) => {
    try {
      // Load GeoJSON data
      const resource = await Cesium.IonResource.fromAssetId(assetId);
      const dataSource = await Cesium.GeoJsonDataSource.load(resource);
      viewer.dataSources.add(dataSource);

      // Create a switch for the GeoJSON layer
      const switchId = labelText.replace(/\s+/g, '').toLowerCase() + 'Switch';
      const geoJSONSwitch = createSwitch(switchId, labelText, viewer, dataSource);
      document.body.appendChild(geoJSONSwitch.container);
    } catch (error) {
      console.error(`Error loading ${labelText} GeoJSON:`, error);
    }
  };

  // Load and create switches for GeoJSON layers
  createGeoJSONSwitch(2477200, 'MTS Streets GeoJSON');
  createGeoJSONSwitch(2477557, 'mtsparks GeoJSON');
  createGeoJSONSwitch(2477597, 'mtscso GeoJSON');
  createGeoJSONSwitch(2477584, 'MTSGasPipelines GeoJSON');
  createGeoJSONSwitch(2477618, 'mtsrail GeoJSON');
};

// Function to create a switch for a layer
const createSwitch = (switchId, labelText, viewer, dataSource) => {
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

  // Event listener for the switch
  layerSwitch.addEventListener('change', async (event) => {
    await dataSource.when();
    dataSource.show = event.target.checked;
    console.log(`${labelText} switch:`, event.target.checked);
  });

  return { container: layerSwitchContainer, switch: layerSwitch };
};

// Call the initializeCesium function
initializeCesium();

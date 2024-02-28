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

// Load 3D Tileset - Tileset 1
const tileset1 = await Cesium.Cesium3DTileset.fromIonAssetId(2475248);
viewer.scene.primitives.add(tileset1);
await viewer.zoomTo(tileset1);

// Apply default style to the tileset if available
const extras1 = tileset1.asset ? tileset1.asset.extras : undefined;
if (Cesium.defined(extras1) && Cesium.defined(extras1.ion) && Cesium.defined(extras1.ion.defaultStyle)) {
  tileset1.style = new Cesium.Cesium3DTileStyle(extras1.ion.defaultStyle);
}

// Load 3D Tileset - Tileset 2 (mtsstreets)
const tileset2 = await Cesium.Cesium3DTileset.fromIonAssetId(2477200);
viewer.scene.primitives.add(tileset2);
await viewer.zoomTo(tileset2);

// Apply default style to the tileset if available
const extras2 = tileset2.asset ? tileset2.asset.extras : undefined;
if (Cesium.defined(extras2) && Cesium.defined(extras2.ion) && Cesium.defined(extras2.ion.defaultStyle)) {
  tileset2.style = new Cesium.Cesium3DTileStyle(extras2.ion.defaultStyle);
}

// Remove the default satellite imagery layers
viewer.imageryLayers.removeAll();

// Create a switch for the 3D Tilesets
const tileset1Switch = document.getElementById('tileset1Switch');
tileset1Switch.addEventListener('change', (event) => {
  tileset1.show = event.target.checked;
});

const tileset2Switch = document.getElementById('tileset2Switch');
tileset2Switch.addEventListener('change', (event) => {
  tileset2.show = event.target.checked;
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
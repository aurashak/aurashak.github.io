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
  
    // Function to load and toggle GeoJSON layer for MTS Streets
    const loadMTSStreetsGeoJSONLayer = async () => {
      try {
        // Load GeoJSON data for MTS Streets
        const resource = await Cesium.IonResource.fromAssetId(2477200);
        const dataSource = await Cesium.GeoJsonDataSource.load(resource);
        viewer.dataSources.add(dataSource);
  
        // Create a switch for MTS Streets GeoJSON layer
        const mtsStreetsSwitch = document.getElementById('mtsStreetsSwitch');
        mtsStreetsSwitch.addEventListener('change', async (event) => {
          await dataSource.when();
          dataSource.show = event.target.checked;
          console.log(`MTS Streets GeoJSON switch:`, event.target.checked);
        });
      } catch (error) {
        console.error(`Error loading MTS Streets GeoJSON:`, error);
      }
    };
  
    // Load and toggle MTS Streets GeoJSON layer with switch
    loadMTSStreetsGeoJSONLayer();
  };
  
  // Call the initializeCesium function
  initializeCesium();
  
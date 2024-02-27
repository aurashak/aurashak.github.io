// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjAyN2RmMC05ZDQxLTQwM2YtOWZiZC1hMTI5ZDZlMDgyMGIiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDM4MzA3Njh9.5yn30zsnLQltPUj52_wu8sNHKKNeHkGVi267uKmzI3Q";


const initializeCesium = async () => {
  const viewer = new Cesium.Viewer('cesiumContainer', {
    // ... (other viewer settings)
  });

  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000;

  const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2475248);
  viewer.scene.primitives.add(tileset);
  await viewer.zoomTo(tileset);

  const extras = tileset.asset.extras;
  if (Cesium.defined(extras) && Cesium.defined(extras.ion) && Cesium.defined(extras.ion.defaultStyle)) {
    tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
  }

  viewer.imageryLayers.removeAll();

  const tilesetSwitch = document.getElementById('3dTileSwitch');
  tilesetSwitch.addEventListener('change', (event) => {
    tileset.show = event.target.checked;
  });

  const loadGeoJSONLayer = async (assetId, switchId, labelText) => {
    try {
      const resource = await Cesium.IonResource.fromAssetId(assetId);
      const dataSource = await Cesium.GeoJsonDataSource.load(resource);
      viewer.dataSources.add(dataSource);

      const layerSwitch = document.createElement('input');
      layerSwitch.type = 'checkbox';
      layerSwitch.checked = true;
      layerSwitch.id = switchId;

      const layerLabel = document.createElement('label');
      layerLabel.appendChild(layerSwitch);
      layerLabel.appendChild(document.createTextNode(labelText));

      const layerSwitchContainer = document.createElement('div');
      layerSwitchContainer.classList.add('switch-container');
      layerSwitchContainer.appendChild(layerLabel);

      document.body.appendChild(layerSwitchContainer);

      layerSwitch.addEventListener('change', async (event) => {
        await dataSource.readyPromise;
        dataSource.show = event.target.checked;
        console.log(`${labelText} GeoJSON switch:`, event.target.checked);
      });
    } catch (error) {
      console.error(`Error loading ${labelText} GeoJSON:`, error);
    }
  };

  // Corrected assetId for 'parksSwitch'
  loadGeoJSONLayer(2477601, 'parksSwitch', 'Parks GeoJSON');
  loadGeoJSONLayer(2477586, 'mtsgaspipelinesSwitch', 'MTSGasPipelines GeoJSON');
  loadGeoJSONLayer(2477585, 'mtsparksSwitch', 'mtsparks GeoJSON');
  loadGeoJSONLayer(2477597, 'mtscsoSwitch', 'mtscso GeoJSON');
  loadGeoJSONLayer(2477584, 'mtsgaspipelinesSwitch', 'MTSGasPipelines GeoJSON');
  loadGeoJSONLayer(2477618, 'mtsrailSwitch', 'mtsrail GeoJSON');
};

initializeCesium();

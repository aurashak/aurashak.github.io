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

    // Fly to New York City
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

    // minimum and maximum zoom limits
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 70000;

    // Load Cesium Bing Maps layer
    const bingMapsLayer = viewer.imageryLayers.addImageryProvider(
      await Cesium.IonImageryProvider.fromAssetId(4),
    );

    // Create a switch event listener for the Bing Maps layer
    const bingMapsSwitch = document.getElementById("bingMapsSwitch");
    bingMapsSwitch.addEventListener("change", (event) => {
      bingMapsLayer.show = event.target.checked;
      const status = event.target.checked ? "shown" : "hidden";
      console.log(`Bing Maps Layer ${status}`);
    });

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

  // Set the switch to the off position initially
  osmBuildingsSwitch.checked = false;

  osmBuildingsSwitch.addEventListener("change", (event) => {
    osmBuildingsTileset.show = event.target.checked;
  });

  // Hide the OSM buildings Tileset initially
  osmBuildingsTileset.show = false;

  console.log("Initial state of OSM buildings Tileset: Hidden");

  // ... (Repeat the pattern for other data sources)

  // Load mtsstreets GeoJsonDataSource
  const mtsstreetsResource = await Cesium.IonResource.fromAssetId(2477125);
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

  // Set the switch to the off position initially
  mtsstreetsSwitch.checked = false;

  mtsstreetsSwitch.addEventListener("change", (event) => {
    if (event.target.checked) {
      viewer.dataSources.add(mtsstreetsDataSource);
      console.log("mtsstreetsDataSource added to viewer");
    } else {
      viewer.dataSources.remove(mtsstreetsDataSource);
      console.log("mtsstreetsDataSource removed from viewer");
    }
  });

  // Do not add mtsstreetsDataSource initially, as the switch is off
  console.log("Initial state of mtsstreetsDataSource: Not added to viewer");
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
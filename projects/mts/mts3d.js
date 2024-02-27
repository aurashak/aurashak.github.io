// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjAyN2RmMC05ZDQxLTQwM2YtOWZiZC1hMTI5ZDZlMDgyMGIiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDM4MzA3Njh9.5yn30zsnLQltPUj52_wu8sNHKKNeHkGVi267uKmzI3Q";


const initializeCesium = async () => {
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

    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000;

    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2475248);
    const tilesetPrimitive = viewer.scene.primitives.add(tileset);
    await viewer.zoomTo(tileset);

    const extras = tileset.asset.extras;
    if (Cesium.defined(extras) && Cesium.defined(extras.ion) && Cesium.defined(extras.ion.defaultStyle)) {
      tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
    }

    // Remove the satellite imagery
    viewer.imageryLayers.removeAll();

    // Create a switch for the 3D layer
    const tilesetSwitch = document.getElementById('3dTileSwitch');

    // Event listener for 3D Tileset switch
    tilesetSwitch.addEventListener('change', (event) => {
      tileset.show = event.target.checked;
    });

    // Load "mtsstreets" GeoJSON data and add it as a new data source
    const streetsResource = await Cesium.IonResource.fromAssetId(2477200);
    const streetsDataSource = await Cesium.GeoJsonDataSource.load(streetsResource);
    viewer.dataSources.add(streetsDataSource);

    // Create a switch for the streets GeoJSON layer
    const streetsSwitch = document.createElement('input');
    streetsSwitch.type = 'checkbox';
    streetsSwitch.checked = true; // Set initial state
    streetsSwitch.id = 'streetsSwitch';

    const streetsLabel = document.createElement('label');
    streetsLabel.appendChild(streetsSwitch);
    streetsLabel.appendChild(document.createTextNode('MTS Streets GeoJSON'));

    const streetsSwitchContainer = document.createElement('div');
    streetsSwitchContainer.classList.add('switch-container');
    streetsSwitchContainer.appendChild(streetsLabel);

    // Add the streets switch to the page
    document.body.appendChild(streetsSwitchContainer);

    // Event listener for Streets GeoJSON switch
    streetsSwitch.addEventListener('change', async (event) => {
      // Wait for the data source to be ready
      await streetsDataSource.when();

      streetsDataSource.show = event.target.checked;
    });
    
    // Load additional GeoJSON data and add it as a new data source
    const additionalResource = await Cesium.IonResource.fromAssetId(2477557);
    const additionalDataSource = await Cesium.GeoJsonDataSource.load(additionalResource);
    viewer.dataSources.add(additionalDataSource);

    // Additional switch for the new GeoJSON layer
    const additionalSwitch = document.createElement('input');
    additionalSwitch.type = 'checkbox';
    additionalSwitch.checked = true; // Set initial state
    additionalSwitch.id = 'additionalSwitch';

    const additionalLabel = document.createElement('label');
    additionalLabel.appendChild(additionalSwitch);
    additionalLabel.appendChild(document.createTextNode('Additional GeoJSON'));

    const additionalSwitchContainer = document.createElement('div');
    additionalSwitchContainer.classList.add('switch-container');
    additionalSwitchContainer.appendChild(additionalLabel);

    // Add the additional switch to the page
    document.body.appendChild(additionalSwitchContainer);

    // Event listener for Additional GeoJSON switch
    additionalSwitch.addEventListener('change', async (event) => {
      // Wait for the data source to be ready
      await additionalDataSource.when();

      additionalDataSource.show = event.target.checked;
    });
  };

  initializeCesium();




/*

const viewer = new Cesium.Viewer('cesiumContainer');

const ionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjAyN2RmMC05ZDQxLTQwM2YtOWZiZC1hMTI5ZDZlMDgyMGIiLCJpZCI6MT'; // Replace with your actual token
const tilesetId = '2275207'; // Replace with your actual tileset ID

viewer.imageryLayers.addImageryProvider(
  Cesium.IonProvider.fromAccessToken(ionToken)
    .createImageryProvider({
      assetId: tilesetId
    })
);





// Immediately-invoked asynchronous function
(async function () {
    const viewer = new Cesium.Viewer("cesiumContainer", {
        // This is a global 3D Tiles tileset so disable the
        // globe to prevent it from interfering with the data
        globe: false,
        // Disabling the globe means we need to manually
        // re-enable the atmosphere
        skyAtmosphere: new Cesium.SkyAtmosphere(),
        // 2D and Columbus View are not currently supported
        // for global 3D Tiles tilesets
        sceneModePicker: false,
        // Imagery layers are not currently supported for
        // global 3D Tiles tilesets
        baseLayerPicker: false,
    });

    try {
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
        viewer.scene.primitives.add(tileset);
    } catch (error) {
        console.log(error);
    }

    // Set the camera to focus slightly further west, facing east, and at a closer zoom
    viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-73.97421308903137, 40.820382982431454, 500.0),
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(-25),
            roll: Cesium.Math.toRadians(0),
        },
    });
})();

*/





/*
(async () => {
    // Replace 'YOUR_CESIUM_ION_TOKEN' with your actual Cesium Ion access token
    const cesiumIonToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjAyN2RmMC05ZDQxLTQwM2YtOWZiZC1hMTI5ZDZlMDgyMGIiLCJpZCI6MT';

    var viewer = new Cesium.Viewer('cesiumContainer', {
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

    // Use the Cesium viewer instance to add the 3D model
    const resource = await Cesium.IonResource.fromAssetId(2472722, { accessToken: cesiumIonToken });
    const entity = viewer.entities.add({
      model: { uri: resource },
    });
  })();

  */



/*

// Load the first GeoJSON data and add it as a polyline to the map
Cesium.GeoJsonDataSource.load('https://aurashak.github.io/geojson/nyc/nygaspipelines.geojson').then(function(dataSource1) {
    viewer.dataSources.add(dataSource1);

    // Get the entities from the data source
    var entities1 = dataSource1.entities.values;

    // Style the polyline
    entities1.forEach(function(entity) {
        if (Cesium.defined(entity.polyline)) {
            entity.polyline.material = Cesium.Color.PURPLE;
            entity.polyline.width = 5.0; // You can adjust the weight/width of the line as needed
        }
    });
}).otherwise(function(error) {
    console.error(error);
});

// Load the second GeoJSON data and add it as circle markers to the map
Cesium.GeoJsonDataSource.load('https://aurashak.github.io/geojson/nyc/nycso.geojson').then(function(dataSource2) {
    viewer.dataSources.add(dataSource2);

    // Get the entities from the data source
    var entities2 = dataSource2.entities.values;

    // Style the circle markers
    entities2.forEach(function(entity) {
        if (Cesium.defined(entity.point)) {
            entity.point.color = Cesium.Color.BROWN.withAlpha(0.5); // Brown color with 50% transparency
            entity.point.pixelSize = 10.0; // You can adjust the size of the circle as needed
        }
    });
}).otherwise(function(error) {
    console.error(error);
});


// Load the third GeoJSON data and add it as circle markers (green)
Cesium.GeoJsonDataSource.load('https://aurashak.github.io/geojson/nyc/aqisite.geojson').then(function(dataSource3) {
    viewer.dataSources.add(dataSource3);

    // Get the entities from the data source
    var entities3 = dataSource3.entities.values;

    // Style the circle markers (green)
    entities3.forEach(function(entity) {
        if (Cesium.defined(entity.point)) {
            entity.point.color = Cesium.Color.GREEN;
            entity.point.pixelSize = 10.0;
        }
    });
}).otherwise(function(error) {
    console.error(error);
});

// Load the fourth GeoJSON data and add it as polygons (blue)
Cesium.GeoJsonDataSource.load('https://aurashak.github.io/geojson/nyc/100yearfloodplain.geojson').then(function(dataSource4) {
    viewer.dataSources.add(dataSource4);

    // Get the entities from the data source
    var entities4 = dataSource4.entities.values;

    // Style the polygons (blue)
    entities4.forEach(function(entity) {
        if (Cesium.defined(entity.polygon)) {
            entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.5);
            // Additional styling for the polygon if needed
        }
    });
}).otherwise(function(error) {
    console.error(error);
});

// Load the fifth GeoJSON data and add it as triangles (red)
Cesium.GeoJsonDataSource.load('https://aurashak.github.io/geojson/nyc/wastewatertreatment.geojson').then(function(dataSource5) {
    viewer.dataSources.add(dataSource5);

    // Get the entities from the data source
    var entities5 = dataSource5.entities.values;

    // Style the triangles (red)
    entities5.forEach(function(entity) {
        if (Cesium.defined(entity.polygon)) {
            entity.polygon.material = Cesium.Color.RED;
            // Additional styling for the triangles if needed
        }
    });
}).otherwise(function(error) {
    console.error(error);
});


*/
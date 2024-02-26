// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjAyN2RmMC05ZDQxLTQwM2YtOWZiZC1hMTI5ZDZlMDgyMGIiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDM4MzA3Njh9.5yn30zsnLQltPUj52_wu8sNHKKNeHkGVi267uKmzI3Q";


const initializeCesium = async () => {
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

  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000;

  // Load 3D Tileset 1
  const tileset1 = await Cesium.Cesium3DTileset.fromIonAssetId(2475248);
  const tilesetPrimitive1 = viewer.scene.primitives.add(tileset1);
  await viewer.zoomTo(tileset1);

  if (Cesium.defined(tileset1.asset) && Cesium.defined(tileset1.asset.extras)) {
    const extras1 = tileset1.asset.extras;
    if (Cesium.defined(extras1.ion) && Cesium.defined(extras1.ion.defaultStyle)) {
      tileset1.style = new Cesium.Cesium3DTileStyle(extras1.ion.defaultStyle);
    }
  }

  // Load 3D Tileset 2
  const tileset2 = await Cesium.Cesium3DTileset.fromIonAssetId(2477200);
  const tilesetPrimitive2 = viewer.scene.primitives.add(tileset2);
  await viewer.zoomTo(tileset2);

  if (Cesium.defined(tileset2.asset) && Cesium.defined(tileset2.asset.extras)) {
    const extras2 = tileset2.asset.extras;
    if (Cesium.defined(extras2.ion) && Cesium.defined(extras2.ion.defaultStyle)) {
      tileset2.style = new Cesium.Cesium3DTileStyle(extras2.ion.defaultStyle);
    }
  }

  // Remove the satellite imagery
  viewer.imageryLayers.removeAll();

  // Add GeoJSON layers with styling
  const geoJsonLayers = [
    {
      url: 'https://aurashak.github.io/geojson/nyc/mtscso.geojson',
      color: Cesium.Color.RED,
      type: 'Point',
      switchId: 'mtscsoSwitch'
    },
    {
      url: 'https://aurashak.github.io/geojson/nyc/mtsgaspipelines.geojson',
      color: Cesium.Color.PURPLE,
      type: 'LineString',
      switchId: 'mtsgaspipelinesSwitch'
    },
    {
      url: 'https://aurashak.github.io/geojson/nyc/mtswastewatertreatment.geojson',
      color: Cesium.Color.GREEN,
      type: 'Point',
      switchId: 'mtswastewatertreatmentSwitch'
    },
    {
      url: 'https://aurashak.github.io/geojson/nyc/mtsrail.geojson',
      color: Cesium.Color.BLUE,
      type: 'LineString',
      switchId: 'mtsrailSwitch'
    },
    {
      url: 'https://aurashak.github.io/geojson/nyc/mtsstreets.geojson',
      color: Cesium.Color.ORANGE,
      type: 'LineString',
      switchId: 'mtsstreetsSwitch'
    }
  ];

  const switchIds = geoJsonLayers.map(layer => layer.switchId);

   // Event listener for 3D Tileset switch
   document.getElementById('3dTileSwitch').addEventListener('change', (event) => {
    tilesetPrimitive1.show = event.target.checked;
    tilesetPrimitive2.show = event.target.checked;
  });

  // Event listeners for GeoJSON switches
  switchIds.forEach(switchId => {
    document.getElementById(switchId).addEventListener('change', async (event) => {
      const layer = geoJsonLayers.find(geoJsonLayer => geoJsonLayer.switchId === switchId);

      if (event.target.checked) {
        // Load GeoJSON and add it to the viewer
        try {
          const dataSource = await Cesium.GeoJsonDataSource.load(layer.url, {
            stroke: layer.color,
            markerColor: layer.color,
          });
          viewer.dataSources.add(dataSource);
        } catch (error) {
          console.error('Error loading GeoJSON:', error);
        }
      } else {
        // Remove GeoJSON if the switch is turned off
        const dataSource = viewer.dataSources.getByName(layer.url)[0];
        if (dataSource) {
          viewer.dataSources.remove(dataSource, true);
        }
      }
    });
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
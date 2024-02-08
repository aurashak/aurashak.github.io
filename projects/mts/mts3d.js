Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZWYwNWEzNi0zMThkLTQ5ZjgtODZmNC01ZWI0ODQ1OWVhYTYiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDY3MjIxNjN9.JZdCe1eGQfsow46cZGVVG1r8hL1L0E72AzUsFs1Rw8s';

var viewer = new Cesium.Viewer('mtsmap', {
    globe: false,
    terrainProvider: Cesium.createWorldTerrain(),
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
    scene3DOnly: false,
    sceneMode: Cesium.SceneMode.SCENE3D,
});


try {
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
    viewer.scene.primitives.add(tileset);
  } catch (error) {
    console.log(error);
  }
  
var osm3D = viewer.scene.primitives.add(Cesium.createOsmBuildings());

// Set the camera to focus slightly further west, facing east, and at a closer zoom
viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-73.97421308903137, 40.820382982431454, 500.0),
    orientation: {
        heading: Cesium.Math.toRadians(90),
        pitch: Cesium.Math.toRadians(-25),
        roll: Cesium.Math.toRadians(0),
    },
});



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
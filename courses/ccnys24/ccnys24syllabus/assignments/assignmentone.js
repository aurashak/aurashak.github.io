
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer1', {
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

window.onload = function() {
    var osmLayerSwitch = document.getElementById("osmLayerSwitch");

    if (osmLayerSwitch) {
        osmLayerSwitch.addEventListener("change", function () {
            toggleImageryLayer(osmLayerSwitch.checked ? 1 : 0);
        });
    }

    // Initial state: Load OpenStreetMap layer
    toggleImageryLayer(0);

    // Later in your code, you can change the background color to white again
    viewer.scene.backgroundColor = Cesium.Color.WHITE;

    // Flag to track the current imagery layer
    var isSentinel2Visible = true;

    // Define the sentinel2Layer variable
    var sentinel2Layer;

    function toggleImageryLayer(layer) {
        // Clear all existing layers
        viewer.imageryLayers.removeAll();

        if (layer === 0) {
            // Add OpenStreetMap layer
            viewer.imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
            }));
        } else {
            // Add Sentinel-2 layer
            viewer.imageryLayers.addImageryProvider(
                new Cesium.IonImageryProvider({ assetId: 3954 })
            );
        }
    }




var viewer = new Cesium.Viewer('cesiumContainer');

var drawingMode = false;
var handler;

function addMarker() {
    viewer.entities.add({
        position: viewer.camera.positionWC.clone(),
        label: {
            text: 'Marker Title',
            description: 'Marker Description'
        }
    });
}

function drawLine() {
    startDrawing('LineString');
}

function drawPolygon() {
    startDrawing('Polygon');
}

function startDrawing(type) {
    if (drawingMode) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        endDrawing();
    } else {
        handler = new Cesium.DrawHandler(viewer, type);
        handler.activate();
        drawingMode = true;

        handler.setInputAction(function (movement) {
            var cartesian = viewer.scene.pickPosition(movement.endPosition);
            if (cartesian) {
                // Handle the drawn point, line, or polygon
                handleDrawingResult(cartesian, type);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (movement) {
            // Handle mouse move during drawing (if needed)
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
}

function endDrawing() {
    drawingMode = false;
}

function handleDrawingResult(cartesian, type) {
    // Handle the result based on the type (point, line, polygon)
    if (type === 'LineString') {
        // Handle line drawing
        // Example: viewer.entities.add({ polyline: { positions: [previousPoint, cartesian], ... } });
    } else if (type === 'Polygon') {
        // Handle polygon drawing
        // Example: viewer.entities.add({ polygon: { hierarchy: Cesium.Cartesian3.fromDegreesArray([previousPoint.longitude, previousPoint.latitude, cartesian.longitude, cartesian.latitude]), ... } });
    }

    // Prompt user for title and description
    var title = prompt('Enter title for the drawn item:', 'Default Title');
    var description = prompt('Enter description for the drawn item:', 'Default Description');

    // Add the drawn item with title and description
    viewer.entities.add({
        position: cartesian,
        label: {
            text: title,
            description: description
        }
    });

    // Perform any additional actions as needed
}
};
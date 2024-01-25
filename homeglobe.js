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

// Add Earth at Night layer
const earthAtNight = Cesium.ImageryLayer.fromProviderAsync(
    Cesium.IonImageryProvider.fromAssetId(3812)
);
earthAtNight.splitDirection = Cesium.SplitDirection.LEFT;
viewer.imageryLayers.add(earthAtNight);

window.onload = function() {
    var osmLayerSwitch = document.getElementById("osmLayerSwitch");
    var earthAtNightSwitch = document.getElementById("earthAtNightSwitch");

    if (osmLayerSwitch && earthAtNightSwitch) {
        osmLayerSwitch.addEventListener("change", function () {
            toggleImageryLayer(osmLayerSwitch.checked ? 1 : 0);
        });

        earthAtNightSwitch.addEventListener("change", function () {
            toggleEarthAtNightLayer(earthAtNightSwitch.checked);
        });
    }

    // Initial state: Load OpenStreetMap layer and turn Earth at Night off
    toggleImageryLayer(0);
    toggleEarthAtNightLayer(false);

    viewer.scene.backgroundColor = Cesium.Color.WHITE;
    var isSentinel2Visible = true;
    var sentinel2Layer;

    function toggleImageryLayer(layer) {
        viewer.imageryLayers.removeAll();

        if (layer === 0) {
            viewer.imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
            }));
        } else {
            viewer.imageryLayers.addImageryProvider(
                new Cesium.IonImageryProvider({ assetId: 3954 })
            );
        }
    }

    function toggleEarthAtNightLayer(isVisible) {
        earthAtNight.show = isVisible;
    }

    var spinRate = 0.0003;
    var isRotating = true;

    function toggleRotation() {
        isRotating = !isRotating;
    }

    var clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    clickHandler.setInputAction(toggleRotation, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    function updateRotation() {
        if (isRotating) {
            viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
        }
    }

    viewer.scene.postRender.addEventListener(updateRotation);
};
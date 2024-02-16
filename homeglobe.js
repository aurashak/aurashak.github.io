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

    // Set the initial rotation rate
    var spinRate = 0.0003;

    // Flag to track rotation state
    var isRotating = true;

    // Function to start or stop the rotation on mouse click
    function toggleRotation() {
        isRotating = !isRotating;
    }

    // Create a click event handler to toggle rotation on mouse click
    var clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    clickHandler.setInputAction(toggleRotation, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Function to update the globe rotation
    function updateRotation() {
        if (isRotating) {
            viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
        }
    }

    // Add a render loop to continuously update the rotation
    viewer.scene.postRender.addEventListener(updateRotation);

// Remove the JavaScript button creation code
// var spinButton = document.createElement('button');
// spinButton.innerHTML = 'Spin Globe';
// spinButton.style.position = 'fixed';
// spinButton.style.top = '10px';
// spinButton.style.left = '10px';
// spinButton.style.padding = '10px';
// spinButton.style.backgroundColor = '#007BFF';
// spinButton.style.color = '#fff';
// spinButton.style.border = 'none';
// spinButton.style.borderRadius = '5px';
// spinButton.style.cursor = 'pointer';
// spinButton.addEventListener('click', function() {
//     spinGlobe();
// });
// document.body.appendChild(spinButton);

// Instead, add a click event listener directly to the div
var spinButton = document.getElementById('spinButton');
spinButton.addEventListener('click', function() {
    spinGlobe();
});


// Function to spin the globe quickly and slow down progressively
function spinGlobe() {
    var minSpinRate = 0.01; // Minimum spin rate for a more aggressive spin
    var maxSpinRate = 0.1; // Maximum spin rate
    var spinAcceleration = 0.0001;
    var decelerationFactor = 0.98; // Factor to gradually slow down the spin

    // Randomly choose the spin direction for each click
    var spinDirectionX = Math.random() > 0.5 ? 1 : -1;
    var spinDirectionY = Math.random() > 0.5 ? 1 : -1;

    // Set random initial spin rates for X and Y axes
    var initialSpinRateX = minSpinRate + Math.random() * (maxSpinRate - minSpinRate);
    var initialSpinRateY = minSpinRate + Math.random() * (maxSpinRate - minSpinRate);

    function spinStep() {
        if (isRotating) {
            viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinDirectionX * initialSpinRateX);
            viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Y, spinDirectionY * initialSpinRateY);

            initialSpinRateX *= decelerationFactor; // Gradually slow down the spin
            initialSpinRateY *= decelerationFactor;

            if (initialSpinRateX > 0.001 && initialSpinRateY > 0.001) {
                requestAnimationFrame(spinStep);
            } else {
                isRotating = false;

                // Set random initial spin rates for X and Y axes for the next spin
                initialSpinRateX = minSpinRate + Math.random() * (maxSpinRate - minSpinRate);
                initialSpinRateY = minSpinRate + Math.random() * (maxSpinRate - minSpinRate);

                // Randomly choose the spin direction for X and Y axes for the next spin
                spinDirectionX = Math.random() > 0.5 ? 1 : -1;
                spinDirectionY = Math.random() > 0.5 ? 1 : -1;
            }
        }
    }

    // Start the spinning
    isRotating = true;
    spinStep();
}

// Set the button text to an empty string
spinButton.textContent = '';

};
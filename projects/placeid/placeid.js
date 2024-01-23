
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer2', {
    baseLayerPicker: false,
    geocoder: true,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false
});

var geocoder = new Cesium.Geocoder('geocoderContainer', {
    // Geocoder options here
});


viewer.imageryLayers.get(0).brightness = 1.2;
viewer.imageryLayers.get(0).contrast = 1.2;

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 15000000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
    }
});


viewer.camera.percentageChanged = 0.01; // Adjust this threshold as needed



// Function to rotate the globe slowly
function rotateGlobe() {
    if (isRotating) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
    }
}

// Slow down the rotation
var spinRate = 0.0003;
var isRotating = true; // To keep track of the rotation state

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

var defaultText = 'Latitude & Longitudes';
var coordsBox = document.getElementById('coordsBox');
coordsBox.innerHTML = defaultText;
coordsBox.style.display = 'block';

// Define variables to keep track of layer visibility
var osmLayerVisible = true; // OpenStreetMap
var sentinelLayerVisible = true; // Sentinel-2

// Function to toggle OpenStreetMap layer
function toggleOSMLayer() {
    osmLayerVisible = !osmLayerVisible;
    viewer.imageryLayers.get(0).show = osmLayerVisible;
}

// Function to toggle Sentinel-2 layer
function toggleSentinelLayer() {
    sentinelLayerVisible = !sentinelLayerVisible;
    // Replace 'Sentinel-2' with the name of the layer you want to toggle (if it's not the first layer)
    viewer.imageryLayers.get(1).show = sentinelLayerVisible;
}














// Define heights for different layer types
var continentHeight = 500; // Adjust as needed
var oceansHeight = 500; // Adjust as needed
var lakesHeight = 700; // Adjust as needed
var regionsHeight = 600; // Adjust as needed
var citiesHeight = 800; // Adjust as needed


// Function to load and style a GeoJSON layer
function loadAndStyleGeoJson(url, color, outlineColor, height, isRiverLayer, isCountryLayer, isOceanLayer, isRegionsLayer, isCitiesLayer) {
    Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
        dataSource.entities.values.forEach(function(entity) {
            if (entity.polygon) {
                if (isRegionsLayer) {
                    entity.polygon.material = color.withAlpha(0.01);
                    entity.polygon.outline = true;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                } else if (isCountryLayer) {
                    entity.polygon.material = color.withAlpha(0.01);
                    entity.polygon.outline = true;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                } else if (isOceanLayer) {
                    entity.polygon.material = color.withAlpha(0.01);
                    entity.polygon.outline = false;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                } else if (isCitiesLayer) {
                    entity.polygon.material = color.withAlpha(0.1);
                    entity.polygon.outline = false;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                } else {
                    entity.polygon.material = color.withAlpha(0.01);
                    entity.polygon.outline = false;
                    entity.polygon.outlineColor = outlineColor;
                    entity.polygon.extrudedHeight = height;
                }
            } else if (isRiverLayer && entity.polyline) {
                var riverColor = Cesium.Color.fromCssColorString('#6495ED').withAlpha(1);
                var offsetHeight = 10;
                entity.polyline.material = riverColor;
                entity.polyline.width = 10;
                entity.polyline.clampToGround = true;
                entity.polyline.arcType = Cesium.ArcType.GEODESIC;
                entity.polyline.positions = new Cesium.CallbackProperty(function() {
                    var cartographicPositions = entity.polyline.positions.getValue().map(function(position) {
                        var cartographic = Cesium.Cartographic.fromCartesian(position);
                        return Cesium.Cartesian3.fromDegrees(
                            Cesium.Math.toDegrees(cartographic.longitude),
                            Cesium.Math.toDegrees(cartographic.latitude),
                            cartographic.height + offsetHeight
                        );
                    });
                    return cartographicPositions;
                }, false);
            }
        });

        viewer.dataSources.add(dataSource);
    }).otherwise(function(error){
        console.error('Error loading GeoJSON data:', error);
    });
}






// URLs to the GeoJSON data
var oceansGeojsonUrl = 'https://aurashak.github.io/geojson/world/oceans.geojson'; 

var europeGeojsonUrl = 'https://aurashak.github.io/geojson/world/europe.json';
var asiaGeojsonUrl = 'https://aurashak.github.io/geojson/world/asia.json';
var africaGeojsonUrl = 'https://aurashak.github.io/geojson/world/africa.json';
var oceanaGeojsonUrl = 'https://aurashak.github.io/geojson/world/oceana.json';
var northamericaGeojsonUrl = 'https://aurashak.github.io/geojson/world/northamerica.json';
var southamericaGeojsonUrl = 'https://aurashak.github.io/geojson/world/southamerica.json';
var antarcticaGeojsonUrl = 'https://aurashak.github.io/geojson/world/antarctica.geojson';
var lakesGeojsonUrl = 'https://aurashak.github.io/geojson/world/lakes.json';
var regionsGeojsonUrl = 'https://aurashak.github.io/geojson/world/regions.geojson';
var riversGeojsonUrl = 'https://aurashak.github.io/geojson/world/rivers.geojson';
var citiesGeojsonUrl = 'https://aurashak.github.io/geojson/world/cities.geojson';

// Load and style the layers
loadAndStyleGeoJson(oceansGeojsonUrl, Cesium.Color.RED.withAlpha(1), Cesium.Color.WHITE, oceansHeight, false, false, true); // For oceans
loadAndStyleGeoJson(regionsGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, regionsHeight, false, false, false, true); // For regions
loadAndStyleGeoJson(europeGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Europe
loadAndStyleGeoJson(asiaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Asia, set isCountryLayer to true
loadAndStyleGeoJson(africaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Africa, set isCountryLayer to true
loadAndStyleGeoJson(oceanaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Oceania, set isCountryLayer to true
loadAndStyleGeoJson(northamericaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For North America, set isCountryLayer to true
loadAndStyleGeoJson(southamericaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For South America, set isCountryLayer to true
loadAndStyleGeoJson(antarcticaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true); // For Antarctica
loadAndStyleGeoJson(lakesGeojsonUrl, Cesium.Color.BLUE.withAlpha(0.01), Cesium.Color.WHITE, lakesHeight); // For lakes
loadAndStyleGeoJson(riversGeojsonUrl, Cesium.Color.BLUE.withAlpha(0.01), Cesium.Color.BLUE, true); // For rivers
loadAndStyleGeoJson(citiesGeojsonUrl, Cesium.Color.BLUE.withAlpha(1), Cesium.Color.BLUE, citiesHeight, false, false, false, false, true);






// Function to show updating coordinates
function showCoordinates(movement) {
    var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);

    if (cartesian) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
        var hoverText = 'Latitude: ' + latitudeString + '°, Longitude: ' + longitudeString + '°';

        coordsBox.innerHTML = hoverText;
    }
}

viewer.screenSpaceEventHandler.setInputAction(showCoordinates, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

handler.setInputAction(showCoordinates, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


// Additionally, you may want to set up an event listener for when the mouse leaves the globe
// to set the coordsBox to the default text
viewer.scene.canvas.addEventListener('mouseleave', function() {
    coordsBox.innerHTML = defaultText;
    coordsBox.style.display = 'block';
});



// Create HTML elements to display feature information for each feature type
var infoBoxes = {};

// Define feature types
var featureTypes = [
    'name', 'Canal', 'Ocean', 'Sea', 'strait', 'Bay', 'Sound', 'Channel', 'Lake', 'Gulf', 'reef', 'subregion', 'continent', 'region_un', 'Island', 'Island Group', 'NAME', 'Coast', 'Range/mtn', 'Pen/cap', 'Desert', 'Plateu', 'Depression', 'Plain', 'Delta',  // Make sure these names match your GeoJSON properties
];

// Convert feature types to lowercase for case-insensitive matching
var lowercaseFeatureTypes = featureTypes.map(function (type) {
    return type.toLowerCase();
});

// Create separate info boxes for each feature type
featureTypes.forEach(function (featureType) {
    var infoBox = document.createElement('div');
    infoBox.id = featureType + 'InfoBox'; // Use feature type as part of the ID
    infoBox.classList.add('infobox'); // Add the CSS class to the info box
    
    // Append the info box to the corresponding div element
    var parentDiv = document.getElementById(featureType.toLowerCase() + 'InfoBox'); // Get the parent div by ID
    if (parentDiv) {
        parentDiv.appendChild(infoBox);
    }

    // Store the info box in the dictionary
    infoBoxes[featureType.toLowerCase()] = infoBox; // Use lowercase feature type as the key
});

// Flag to check if the mouse is over any feature
var isMouseOverFeature = false;

// Function to show information when hovering over features
function showFeatureInfo(movement) {
    var pickedObjects = viewer.scene.drillPick(movement.endPosition);



    if (Cesium.defined(pickedObjects)) {
        pickedObjects.forEach(function (pickedObject) {
            var entity = pickedObject.id;

            // Check if the picked object is an entity with properties
            if (entity && entity.properties) {
                var properties = entity.properties;
                var featureType = properties.featurecla && properties.featurecla.getValue();

                if (featureType) {
                    // Convert feature type to lowercase for case-insensitive matching
                    featureType = featureType.toLowerCase();

                    // Get the corresponding info box for this feature type
                    var infoBox = infoBoxes[featureType];

                    // Check if the info box exists
                    if (infoBox) {
                        var featureName = properties.name && properties.name.getValue();

                        // Customize the title based on the property type
                        var title = '';
                        switch (featureType) {
                            case 'name':
                                title = 'River:';
                                break;
                            case 'canal':
                                title = 'Canal:';
                                break;
                            case 'lake':
                                title = 'Lake:';
                                break;
                            case 'ocean':
                                title = 'Ocean:';
                                break;
                            case 'sea':
                                title = 'Sea:';
                                break;
                            case 'strait':
                                title = 'Strait:';
                                break;
                            case 'bay':
                                title = 'Bay:';
                                break;
                            case 'sound':
                                title = 'Sound:';
                                break;
                            case 'channel':
                                title = 'Channel:';
                                break;
                            case 'gulf':
                                title = 'Gulf:';
                                break;
                            case 'reef':
                                title = 'Reef:';
                                break;
                            case 'country':
                                title = 'Country:';
                                break;
                            case 'continent':
                                title = 'Continent:';
                                break;
                                case 'plain':
                                    title = 'Plain:';
                                    break;
                                    case 'plateau':
                                        title = 'Plateau:';
                                        break;
                                        case 'delta':
                                            title = 'Delta:';
                                            break;
                                            case 'range/mtn':
                                                title = 'Mtn Range:';
                                                break;
                                        case 'desert':
                                            title = 'Desert:';
                                            break;
                                            case 'coast':
                                                title = 'Coast:';
                                                break;
                                                case 'subregion':
                                                    title = 'Subregion:';
                                                    break;
                            case 'region_un':
                                title = 'Region:';
                                break;
                            default:
                                title = 'Name:';
                        }

                        // Construct the information string with the customized title
                        infoBox.innerHTML = '<b>' + title + ' ' + featureName + '</b><br>';
                        infoBox.style.display = 'block'; // Show the info box

                        // Set the flag to true since the mouse is over a feature
                        isMouseOverFeature = true;

                            // Reset the flag when the mouse is not over any feature
                            isMouseOverFeature = false;
                    }
                }
            }
        });
    }
}

// Add the event listener for mouse movement
viewer.screenSpaceEventHandler.setInputAction(showFeatureInfo, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

// Add the event listener for mouse hover
viewer.scene.canvas.addEventListener('mouseenter', function () {
    // Check the flag before displaying the info boxes
    if (!isMouseOverFeature) {
        for (var key in infoBoxes) {
            if (infoBoxes.hasOwnProperty(key)) {
                infoBoxes[key].style.display = 'none';
            }
        }
    }
});



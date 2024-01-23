
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjAwYzZhZi1hMWY1LTRhYTgtODYwNi05NGEzOWJjYmU0ZWMiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDQxMzQ3OTd9.6JFFAQdUv-HD2IO8V-vcWbk2jn1dsivyu1qrgA1q67c';

var viewer = new Cesium.Viewer('cesiumContainer2', {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false
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

viewer.camera.percentageChanged = 0.01;

function rotateGlobe() {
    if (isRotating) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate);
    }
}

var spinRate = 0.0003;
var isRotating = true;

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

var defaultText = 'Latitude & Longitudes';
var coordsBox = document.getElementById('coordsBox');
coordsBox.innerHTML = defaultText;
coordsBox.style.display = 'block';

var osmLayerVisible = true;
var sentinelLayerVisible = true;

function toggleOSMLayer() {
    osmLayerVisible = !osmLayerVisible;
    viewer.imageryLayers.get(0).show = osmLayerVisible;
}

function toggleSentinelLayer() {
    sentinelLayerVisible = !sentinelLayerVisible;
    viewer.imageryLayers.get(1).show = sentinelLayerVisible;
}

var continentHeight = 500;
var oceansHeight = 500;
var lakesHeight = 700;
var regionsHeight = 600;
var citiesHeight = 800;

function loadAndStyleGeoJson(url, color, outlineColor, height, isRiverLayer, isCountryLayer, isOceanLayer, isRegionsLayer, isCitiesLayer) {
    Cesium.GeoJsonDataSource.load(url).then(function (dataSource) {
        dataSource.entities.values.forEach(function (entity) {
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
                entity.polyline.positions = new Cesium.CallbackProperty(function () {
                    var cartographicPositions = entity.polyline.positions.getValue().map(function (position) {
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
    }).otherwise(function (error) {
        console.error('Error loading GeoJSON data:', error);
    });
}

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

loadAndStyleGeoJson(oceansGeojsonUrl, Cesium.Color.RED.withAlpha(1), Cesium.Color.WHITE, oceansHeight, false, false, true);
loadAndStyleGeoJson(regionsGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, regionsHeight, false, false, false, true);
loadAndStyleGeoJson(europeGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(asiaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(africaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(oceanaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(northamericaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(southamericaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(antarcticaGeojsonUrl, Cesium.Color.KHAKI, Cesium.Color.BLACK, continentHeight, false, true);
loadAndStyleGeoJson(lakesGeojsonUrl, Cesium.Color.BLUE.withAlpha(0.01), Cesium.Color.WHITE, lakesHeight);
loadAndStyleGeoJson(riversGeojsonUrl, Cesium.Color.BLUE.withAlpha(0.01), Cesium.Color.BLUE, true);
loadAndStyleGeoJson(citiesGeojsonUrl, Cesium.Color.BLUE.withAlpha(1), Cesium.Color.BLUE, citiesHeight, false, false, false, false, true);

var infoBoxes = {};

var featureTypes = [
    'River', 'Lake Centerline', 'Canal', 'Ocean', 'Sea', 'strait', 'Bay', 'Sound', 'Channel', 'Lake', 'Gulf', 'reef',
    'country', 'continent', 'region_un'
];

var lowercaseFeatureTypes = featureTypes.map(function (type) {
    return type.toLowerCase();
});

featureTypes.forEach(function (featureType) {
    var infoBox = document.createElement('div');
    infoBox.id = featureType + 'InfoBox';
    infoBox.classList.add('infobox');

    var parentDiv = document.getElementById(featureType.toLowerCase() + 'InfoBox');
    if (parentDiv) {
        parentDiv.appendChild(infoBox);
    }

    infoBoxes[featureType.toLowerCase()] = infoBox;
});

var isMouseOverFeature = false;

function showFeatureInfo(movement) {
    var pickedObjects = viewer.scene.drillPick(movement.endPosition);

    for (var key in infoBoxes) {
        if (infoBoxes.hasOwnProperty(key)) {
            infoBoxes[key].innerHTML = '';
        }
    }

    isMouseOverFeature = false;

    if (Cesium.defined(pickedObjects)) {
        pickedObjects.forEach(function (pickedObject) {
            var entity = pickedObject.id;

            if (entity && entity.properties) {
                var properties = entity.properties;
                var featureType = properties.featurecla && properties.featurecla.getValue();

                if (featureType) {
                    featureType = featureType.toLowerCase();
                    var infoBox = infoBoxes[featureType];

                    if (infoBox) {
                        var featureName = properties.name && properties.name.getValue();
                        var title = '';

                        switch (featureType) {
                            case 'river':
                                title = 'River Name:';
                                break;
                            case 'lake centerline':
                                title = 'Lake Name:';
                                break;
                            case 'canal':
                                title = 'Canal Name:';
                                break;
                            case 'lake':
                                title = 'Lakes Name:';
                                break;
                            case 'ocean':
                                title = 'Ocean Name:';
                                break;
                            case 'sea':
                                title = 'Sea Name:';
                                break;
                            case 'strait':
                                title = 'Strait Name:';
                                break;
                            case 'bay':
                                title = 'Bay Name:';
                                break;
                            case 'sound':
                                title = 'Sound Name:';
                                break;
                            case 'channel':
                                title = 'Channel Name:';
                                break;
                            case 'gulf':
                                title = 'Gulf Name:';
                                break;
                            case 'reef':
                                title = 'Reef Name:';
                                break;
                            case 'country':
                                title = 'Country Name:';
                                break;
                            case 'continent':
                                title = 'Continent Name:';
                                break;
                            case 'region_un':
                                title = 'Region Name:';
                                break;
                            default:
                                title = 'Name:';
                        }

                        infoBox.innerHTML = '<b>' + title + ' ' + featureName + '</b><br>';
                        infoBox.style.display = 'block';
                        isMouseOverFeature = true;
                    }
                }
            }
        });
    }

    if (!isMouseOverFeature) {
        for (var key in infoBoxes) {
            if (infoBoxes.hasOwnProperty(key)) {
                infoBoxes[key].style.display = 'none';
            }
        }
    }
}

viewer.screenSpaceEventHandler.setInputAction(showFeatureInfo, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

viewer.scene.canvas.addEventListener('mouseleave', function () {
    for (var key in infoBoxes) {
        if (infoBoxes.hasOwnProperty(key)) {
            infoBoxes[key].innerHTML = '';
            infoBoxes[key].style.display = 'none';
        }
    }

    isMouseOverFeature = false;
});

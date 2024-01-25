Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjljMGQ4MS0zNzJkLTQxMjItODk1OC03ZDkwM2VkYzYwMDUiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDYxNTcwNDJ9.9AcXXdl9PUpvx5y-XBR81kIHSjjfRbY6wDM-JPVPCZo';

        var viewer = new Cesium.Viewer('mtsmap', {
            terrainProvider: Cesium.createWorldTerrain(),
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: true,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            animation: false,
            timeline: false,
            scene3DOnly: true,
            sceneMode: Cesium.SceneMode.SCENE3D
        });

        // Set the camera to focus on Upper Manhattan
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(-73.9521, 40.7831, 1500.0),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-45),
                roll: Cesium.Math.toRadians(0)
            },
            duration: 3.0
        });

        // Load 3D buildings in Upper Manhattan
        viewer.scene.primitives.add(Cesium.createOsmBuildings());
document.addEventListener('DOMContentLoaded', function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('cube-container').appendChild(renderer.domElement);

    camera.position.z = 20;

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    // Replace 'https://aurashak.github.io/countries.geojson' with the raw content link of your GeoJSON file on GitHub
    var geoJsonUrl = 'https://aurashak.github.io/countries.geojson';

    // Fetch GeoJSON data
    fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => handleGeoJsonData(data))
        .catch(error => console.error('Error fetching GeoJSON data:', error));

    function handleGeoJsonData(geoJsonData) {
        var countriesGroup = new THREE.Group();

        geoJsonData.features.forEach(function (feature) {
            var geometry = new THREE.ExtrudeGeometry(new THREE.Shape(feature.geometry.coordinates[0]), {
                depth: 1,
                bevelEnabled: false,
            });

            var material = new THREE.MeshBasicMaterial({ color: 0x57A0D2, transparent: true, opacity: 0.7 });

            var countryMesh = new THREE.Mesh(geometry, material);
            countryMesh.name = feature.properties.name;

            countryMesh.onClick = function () {
                console.log('Clicked on ' + feature.properties.name);
                // Add your hyperlink logic here
            };

            countriesGroup.add(countryMesh);
        });

        scene.add(countriesGroup);

        scene.background = new THREE.Color(0xf0f0f0);

        document.addEventListener('mousedown', function (event) {
            var mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(countriesGroup.children);

            if (intersects.length > 0) {
                intersects[0].object.onClick();
            }
        });

        window.addEventListener('resize', function () {
            var newWidth = window.innerWidth;
            var newHeight = window.innerHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        });

        var animate = function () {
            requestAnimationFrame(animate);

            controls.update();

            renderer.render(scene, camera);
        };

        animate();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('cube-container').appendChild(renderer.domElement);

    var initialSphereSize = 2;
    var geometry = new THREE.SphereGeometry(initialSphereSize, 32, 32);
    var material = new THREE.MeshPhongMaterial({ color: 0x888888 });
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    var graticule = new THREE.Object3D();
    var graticuleSpacing = 0.1;

    for (let lat = -90; lat <= 90; lat += graticuleSpacing) {
        var latLineGeometry = new THREE.BufferGeometry();
        var latLineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        latLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
            -1, Math.sin(THREE.Math.degToRad(lat)), Math.cos(THREE.Math.degToRad(lat)),
            1, Math.sin(THREE.Math.degToRad(lat)), Math.cos(THREE.Math.degToRad(lat))
        ], 3));
        var latLine = new THREE.Line(latLineGeometry, latLineMaterial);
        graticule.add(latLine);
    }

    for (let lon = -180; lon <= 180; lon += graticuleSpacing) {
        var lonLineGeometry = new THREE.BufferGeometry();
        var lonLineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        lonLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
            Math.sin(THREE.Math.degToRad(lon)), -1, Math.cos(THREE.Math.degToRad(lon)),
            Math.sin(THREE.Math.degToRad(lon)), 1, Math.cos(THREE.Math.degToRad(lon))
        ], 3));
        var lonLine = new THREE.Line(lonLineGeometry, lonLineMaterial);
        graticule.add(lonLine);
    }

    // Add black lines along the x and y axes
    var xAxisGeometry = new THREE.BufferGeometry();
    var xAxisMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    xAxisGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 0, 0, 1, 0, 0], 3));
    var xAxisLine = new THREE.Line(xAxisGeometry, xAxisMaterial);
    graticule.add(xAxisLine);

    var yAxisGeometry = new THREE.BufferGeometry();
    var yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    yAxisGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, -1, 0, 0, 1, 0], 3));
    var yAxisLine = new THREE.Line(yAxisGeometry, yAxisMaterial);
    graticule.add(yAxisLine);

    scene.add(graticule);

    camera.position.z = 5;

    var mouseDown = false;
    var mouseX = 0;
    var mouseY = 0;

    document.addEventListener('mousedown', function (event) {
        mouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    document.addEventListener('mouseup', function () {
        mouseDown = false;
    });

    document.addEventListener('mousemove', function (event) {
        if (mouseDown) {
            var deltaX = event.clientX - mouseX;
            var deltaY = event.clientY - mouseY;

            sphere.rotation.y += deltaX * 0.01;
            sphere.rotation.x += deltaY * 0.01;

            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    });

    window.addEventListener('resize', function () {
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });

    // Regular slow rotation
    var rotationSpeed = 0.005;

    var animate = function () {
        requestAnimationFrame(animate);

        // Only rotate the sphere when not clicked and dragged
        if (!mouseDown) {
            sphere.rotation.x += rotationSpeed;
            sphere.rotation.y += rotationSpeed;
        }

        renderer.render(scene, camera);
    };

    animate();
});

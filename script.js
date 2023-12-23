document.addEventListener('DOMContentLoaded', function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('cube-container').appendChild(renderer.domElement);

    var initialSphereSize = 2;
    var geometry = new THREE.SphereGeometry(initialSphereSize, 16, 16);

    // Solid blue sphere
    var material = new THREE.MeshPhongMaterial({ color: 0x57A0D2, wireframe: false });
    var sphere = new THREE.Mesh(geometry, material);

    // Wireframe sphere with only vertical and horizontal lines
    var wireframeGeometry = new THREE.EdgesGeometry(geometry);
    var wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    var wireframeSphere = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

    // Slightly larger than the solid sphere
    wireframeSphere.scale.multiplyScalar(1.01);

    // Grouping the solid sphere and wireframe sphere
    var sphereGroup = new THREE.Group();
    sphereGroup.add(sphere);
    sphereGroup.add(wireframeSphere);

    scene.add(sphereGroup);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 5;

    var isRotationPaused = false;
    var mouseX = 0;
    var mouseY = 0;

    document.addEventListener('mousedown', function (event) {
        if (event.button === 0) {
            isRotationPaused = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    });

    document.addEventListener('mouseup', function () {
        isRotationPaused = false;
    });

    document.addEventListener('mousemove', function (event) {
        if (isRotationPaused) {
            var deltaX = event.clientX - mouseX;
            var deltaY = event.clientY - mouseY;

            sphereGroup.rotation.y += deltaX * 0.005;
            sphereGroup.rotation.x += deltaY * 0.005;

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

    var rotationSpeed = 0.005;

    var animate = function () {
        requestAnimationFrame(animate);

        if (!isRotationPaused) {
            sphereGroup.rotation.x += rotationSpeed;
            sphereGroup.rotation.y += rotationSpeed;
            sphereGroup.rotation.z += rotationSpeed;
        }

        renderer.render(scene, camera);
    };

    animate();
});

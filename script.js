document.addEventListener('DOMContentLoaded', function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('cube-container').appendChild(renderer.domElement);

    var initialSphereSize = 2;
    var geometry = new THREE.SphereGeometry(initialSphereSize, 32, 32);
    var material = new THREE.MeshPhongMaterial({ color: 0x888888, wireframe: true });
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    var graticule = new THREE.Object3D();
    var graticuleSpacing = 10;

    // Latitude lines
    for (let lat = -90; lat <= 90; lat += graticuleSpacing) {
        // Exclude the equator and poles
        if (lat !== -90 && lat !== 0 && lat !== 90) {
            const geometry = new THREE.BufferGeometry();
            const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
            geometry.setAttribute('position', new THREE.Float32BufferAttribute([-180, lat, 0, 180, lat, 0], 3));
            const latLine = new THREE.Line(geometry, material);
            graticule.add(latLine);
        }
    }

    // Longitude lines
    for (let lon = -180; lon <= 180; lon += graticuleSpacing) {
        // Exclude the prime meridian
        if (lon !== 0 && lon !== 180 && lon !== -180) {
            const geometry = new THREE.BufferGeometry();
            const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
            geometry.setAttribute('position', new THREE.Float32BufferAttribute([lon, -90, 0, lon, 90, 0], 3));
            const lonLine = new THREE.Line(geometry, material);
            graticule.add(lonLine);
        }
    }

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

            sphere.rotation.y += deltaX * 0.005;
            sphere.rotation.x += deltaY * 0.005;

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

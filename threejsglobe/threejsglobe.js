(function () {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const globeTexture = textureLoader.load('https://aurashak.github.io/threejsglobe/earthtexture2.jpg');

    const globeMaterial = new THREE.MeshBasicMaterial({ map: globeTexture });
    const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
    scene.add(globe);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Position the grid behind the globe along the z-axis
    gridHelper.position.z = -10; // Move the grid further away from the camera

    const light = new THREE.PointLight(0xffffff, 1, 500);
    light.position.set(10, 0, 25);
    scene.add(light);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;

    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.002; // If you want the globe to keep spinning
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
})();

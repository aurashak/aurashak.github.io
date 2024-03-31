(async function () {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 26; // Adjust camera position

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a black cube to act as the background
    const cubeSize = 20000; // Scale up the cube size
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize); // Large cube to cover the entire scene
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black material
    const backgroundCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(backgroundCube);

    // Create the globe
    const earthDiameter = 7917.5; // Diameter of the Earth in miles
    const earthRadius = earthDiameter / 2; // Calculate the radius
    const sphereGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
    const globeTexture = new THREE.TextureLoader().load('https://aurashak.github.io/threejsglobe/earthtexture2.jpg');
    const globeMaterial = new THREE.MeshBasicMaterial({ map: globeTexture });
    const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
    scene.add(globe);

    // Add click, drag, and zoom functionality with limited zoom
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smoothly interpolate camera movement
    controls.dampingFactor = 0.25; // How quickly the damping sets in
    controls.enableZoom = true; // Enable zoom with mouse wheel
    controls.enablePan = false; // Disable pan
    controls.minDistance = 2 * earthRadius; // Minimum distance (zoom in limit)
    controls.maxDistance = 10 * earthRadius; // Maximum distance (zoom out limit)

    // Function to animate the globe rotation
    function animateGlobe() {
        globe.rotation.y += 0.001; // Adjust the rotation speed as needed
    }

    function animate() {
        requestAnimationFrame(animate);
        animateGlobe(); // Call the function to animate the globe rotation
        controls.update(); // Update controls
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
})();

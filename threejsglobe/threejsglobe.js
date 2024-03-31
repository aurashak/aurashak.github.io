(async function () {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a black cube to act as the background
    const cubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000); // Large cube to cover the entire scene
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black material
    const backgroundCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(backgroundCube);

    // Create the globe
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const globeTexture = new THREE.TextureLoader().load('https://aurashak.github.io/threejsglobe/earthtexture2.jpg');
    const globeMaterial = new THREE.MeshBasicMaterial({ map: globeTexture });
    const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
    scene.add(globe);

    // Create the moon
    const moonTexture = new THREE.TextureLoader().load('https://aurashak.github.io/threejsglobe/moontexture.jpg'); // Placeholder texture
    const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
    const moon = new THREE.Mesh(sphereGeometry.clone(), moonMaterial); // Use cloned geometry to avoid modifying the original
    moon.scale.setScalar(0.3); // Scale down the moon size

    // Calculate the distance of the moon from the Earth in the scene
    const moonDistanceInScene = 238.9; // Distance from Earth to Moon in our scene (assuming 1 unit represents 1000 miles)
    moon.position.set(moonDistanceInScene, 0, 0); // Position the moon at a distance from the Earth
    scene.add(moon);

    // Add click, drag, and zoom functionality with limited zoom
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smoothly interpolate camera movement
    controls.dampingFactor = 0.25; // How quickly the damping sets in
    controls.enableZoom = true; // Enable zoom with mouse wheel
    controls.enablePan = false; // Disable pan
    controls.minDistance = 2; // Minimum distance (zoom in limit)
    controls.maxDistance = 60; // Maximum distance (zoom out limit)

    // Function to animate the globe rotation and moon orbit
    function animateScene() {
        globe.rotation.y += 0.001; // Rotate the Earth
        // Simulate moon's orbit around the Earth
        const time = Date.now() * 0.001;
        const moonOrbitSpeed = 0.1;
        moon.position.x = moonDistanceInScene * Math.cos(time * moonOrbitSpeed);
        moon.position.z = moonDistanceInScene * Math.sin(time * moonOrbitSpeed);
    }

    function animate() {
        requestAnimationFrame(animate);
        animateScene(); // Call the function to animate the scene
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

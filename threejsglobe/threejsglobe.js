(async function () {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 100); // Set camera position to view the scene
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white ambient light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // White directional light
    directionalLight.position.set(0, 0, 1); // From camera's perspective
    scene.add(directionalLight);

    // Create Earth geometry and texture
    const earthRadius = 6371; // Earth's radius in kilometers
    const earthTexture = new THREE.TextureLoader().load('https://aurashak.github.io/threejsglobe/earthtexture2.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 32, 32), earthMaterial);
    scene.add(earth);

    // Create Moon geometry and texture
    const moonDistance = 384400; // Distance from Earth to Moon in kilometers
    const moonRadius = 1737.4; // Moon's radius in kilometers
    const moonTexture = new THREE.TextureLoader().load('https://aurashak.github.io/threejsglobe/moontexture.jpg');
    const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(moonRadius, 32, 32), moonMaterial);
    moon.position.set(moonDistance, 0, 0); // Position the Moon relative to the Earth
    scene.add(moon);

    // Add click and rotate functionality
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smoothly interpolate camera movement
    controls.dampingFactor = 0.25; // How quickly the damping sets in
    controls.enableZoom = true; // Enable zoom with mouse wheel
    controls.enablePan = false; // Disable pan

    // Function to animate the scene
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Update controls
        renderer.render(scene, camera);
    }

    animate();

    // Resize handling
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
})();

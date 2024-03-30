(function () {
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

    const light = new THREE.PointLight(0xffffff, 1, 500);
    light.position.set(10, 0, 25);
    scene.add(light);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;

    // Add glow effect
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.1;
    bloomPass.strength = 2;
    bloomPass.radius = 1;
    const bloomComposer = new THREE.EffectComposer(renderer);
    bloomComposer.renderToScreen = true;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    // Function to fetch emissions data from Climate Watch API
    async function fetchEmissionsData() {
        const apiUrl = 'https://api.climatewatchdata.org/v1/data/historical_emissions?gas=CO2&source=CAIT&sort_by=year&sort_order=desc';
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching emissions data:', error);
            return null;
        }
    }

    // Function to map emissions data onto the globe
    async function mapEmissionsData() {
        const emissionsData = await fetchEmissionsData();
        if (!emissionsData) return;

        const maxEmissions = Math.max(...emissionsData.map(entry => entry.value));

        emissionsData.forEach(entry => {
            // Calculate latitude and longitude based on country
            const lat = entry.location.latitude;
            const lon = entry.location.longitude;

            // Convert latitude and longitude to spherical coordinates
            const phi = (90 - lat) * Math.PI / 180;
            const theta = (180 - lon) * Math.PI / 180;

            // Convert spherical coordinates to Cartesian coordinates
            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.cos(phi);
            const z = Math.sin(phi) * Math.sin(theta);

            // Calculate size of emission marker based on emission value
            const size = 0.05 + (entry.value / maxEmissions) * 0.2;

            // Create emission marker
            const markerGeometry = new THREE.SphereGeometry(size, 8, 8);
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(x, y, z).multiplyScalar(1.01); // Slightly above globe's surface
            scene.add(marker);
        });
    }

    mapEmissionsData();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        bloomComposer.render();
    }

    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        bloomComposer.setSize(window.innerWidth, window.innerHeight);
    });
})();

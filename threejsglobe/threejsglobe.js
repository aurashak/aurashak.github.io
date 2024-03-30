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

    const light = new THREE.PointLight(0xffffff, 1, 500);
    light.position.set(10, 0, 25);
    light.intensity = 0.7; // Adjust the intensity value (between 0 and 1) to control brightness
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

    // Function to fetch emissions data from Climate Watch API for a specific year range
    async function fetchEmissionsData(startYear, endYear) {
        const apiUrl = `https://api.climatewatchdata.org/v1/data/historical_emissions?start_year=${startYear}&end_year=${endYear}`;
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
    async function mapEmissionsData(startYear, endYear) {
        const emissionsData = await fetchEmissionsData(startYear, endYear);
        if (!emissionsData) return;

        // Your mapping logic here
    }

    // Set the start year and end year for the data range
    const startYear = 1960;
    const endYear = 2020;

    // Call the function to map emissions data onto the globe
    mapEmissionsData(startYear, endYear);

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

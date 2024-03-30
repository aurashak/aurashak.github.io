(function () {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Load a star texture
    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load('https://aurashak.github.io/threejsglobe/starmap_4k.jpg'); // Example star texture

    // Create a cube geometry
    const cubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000); // Large cube to cover the entire scene
    // Apply the star texture to the cube's faces
    const cubeMaterials = [
        new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide }), // Back side
        new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide }), // Front side
        new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide }), // Top side
        new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide }), // Bottom side
        new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide }), // Right side
        new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide }) // Left side
    ];
    const starCube = new THREE.Mesh(cubeGeometry, cubeMaterials);
    scene.add(starCube);

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const globeTexture = textureLoader.load('https://aurashak.github.io/threejsglobe/earthtexture2.jpg');
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

(async function () {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100; // Adjust camera position to view the entire scene

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a black background
    const backgroundCubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
    const backgroundCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const backgroundCube = new THREE.Mesh(backgroundCubeGeometry, backgroundCubeMaterial);
    scene.add(backgroundCube);

    // Create the Earth
    const earthRadius = 10; // Adjust size as needed
    const earthTexture = new THREE.TextureLoader().load('https://aurashak.github.io/threejsglobe/earthtexture2.jpg');
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 32, 32), earthMaterial);
    scene.add(earth);

    // Create space between Earth and Moon
    const spaceGeometry = new THREE.SphereGeometry(100, 32, 32); // Adjust radius as needed
    const spaceMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 }); // Blue, semi-transparent
    const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    space.position.set(50, 0, 0); // Adjust position to be between Earth and Moon
    scene.add(space);

    // Create the Moon
    const moonRadius = 2; // Adjust size as needed
    const moonTexture = new THREE.TextureLoader().load('https://aurashak.github.io/threejsglobe/moontexture.jpg');
    const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(moonRadius, 32, 32), moonMaterial);
    moon.position.set(150, 0, 0); // Adjust position to be farther from Earth
    scene.add(moon);

    // Add ambient light to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Function to animate the scene
    function animate() {
        requestAnimationFrame(animate);
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

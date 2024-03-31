(async function () {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 100); // Set camera position to view the scene

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create Earth geometry and texture
    const earthRadius = 10; // Adjust size as needed
    const earthTexture = new THREE.TextureLoader().load('https://aurashak.github.io/threejsglobe/earthtexture2.jpg');
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 32, 32), earthMaterial);
    scene.add(earth);

    // Create Moon geometry and texture
    const moonDistance = 30; // Adjust distance from Earth
    const moonRadius = 2; // Adjust size as needed
    const moonTexture = new THREE.TextureLoader().load('https://aurashak.github.io/threejsglobe/moontexture.jpg');
    const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(moonRadius, 32, 32), moonMaterial);
    moon.position.set(moonDistance, 0, 0); // Position the Moon relative to the Earth
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

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

    // Function to animate the globe rotation
    function animateGlobe() {
        globe.rotation.y += 0.001; // Adjust the rotation speed as needed
    }

    function animate() {
        requestAnimationFrame(animate);
        animateGlobe(); // Call the function to animate the globe rotation
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
})();

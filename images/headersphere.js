// Initialize Three.js scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('sphereCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create a sphere geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// Create a wireframe material
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

// Combine geometry and material to create the wireframe sphere
const sphere = new THREE.Mesh(sphereGeometry, wireframeMaterial);
scene.add(sphere);

// Set the initial rotation of the sphere (20 degrees)
sphere.rotation.x = THREE.MathUtils.degToRad(20);

// Function to animate the sphere
const animate = () => {
    requestAnimationFrame(animate);

    // Rotate the sphere
    sphere.rotation.x += 0.005; // Adjust rotation speed as needed
    sphere.rotation.y += 0.005;

    // Render the scene
    renderer.render(scene, camera);
};

// Start the animation
animate();

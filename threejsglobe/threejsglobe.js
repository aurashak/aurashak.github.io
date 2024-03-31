// Constants
const earthRadius = 6371; // Earth radius in kilometers

// Scene setup
console.log("Setting up scene...");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position on the sphere
camera.position.set(0, 0, earthRadius * 2); // Place the camera at a distance of twice the radius of the Earth
camera.lookAt(scene.position); // Camera looks at the center of the scene

// Add lights
console.log("Adding lights...");
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Fetch data and render Earth
console.log("Fetching data...");
fetch('earth_data.csv')
    .then(response => response.text())
    .then(data => {
        // Parse CSV data and render Earth
        console.log("Data fetched successfully:", data);
        const earthGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
        const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earthMesh);
        console.log("Earth rendered.");
    })
    .catch(error => console.error("Failed to fetch data:", error));

// Enable click and rotate controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableRotate = true; // Allow rotation
controls.enableZoom = false; // Disable zoom

// Render loop
console.log("Starting render loop...");
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update(); // Update controls
}
animate();

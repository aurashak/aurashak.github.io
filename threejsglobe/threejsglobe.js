// render_scene.js

// Constants
const earthRadius = 6371; // Earth radius in kilometers
const moonRadius = 1737.1; // Moon radius in kilometers

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Load data and render Earth and Moon
console.log("Fetching data...");
loadDataAndRender();

function loadDataAndRender() {
    // Fetch data from the server (e.g., using fetch API)
    // For demonstration purposes, let's assume we have already fetched data
    console.log("Data fetched successfully.");

    const earthData = {
        x: 0,
        y: 0,
        z: 0 // Earth is at the center (0, 0, 0)
    };

    const moonData = {
        x: 3,
        y: 0,
        z: 0 // Moon is 3 units away from Earth along the x-axis
    };

    // Render Earth
    console.log("Rendering Earth...");
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.set(earthData.x, earthData.y, earthData.z);
    scene.add(earthMesh);

    // Render Moon
    console.log("Rendering Moon...");
    const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(moonData.x, moonData.y, moonData.z);
    scene.add(moonMesh);

    // Set camera position
    camera.position.z = 10;

    // Render loop
    console.log("Starting render loop...");
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

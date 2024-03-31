console.log("Script loaded");

// Setup scene
const scene = new THREE.Scene();
console.log("Scene created");

// Create cube
// Define the size of the cube in miles
const cubeSizeMiles = 300000; // Each unit represents a mile
const cubeSize = cubeSizeMiles; // Size of the cube in scene units

const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);
console.log("Cube created");

// Convert sphere radius to scene units
const sphereRadiusMiles = 7913.5;
const sphereRadiusUnits = sphereRadiusMiles / cubeSize * 2; // Convert to scene units

// Create sphere with adjusted radius
const sphereGeometry = new THREE.SphereGeometry(sphereRadiusUnits, 32, 32);
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://aurashak.github.io/threejsglobe/earthtexture2.jpg');
const sphereMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
console.log("Sphere created");

// Position sphere at the center
sphere.position.set(0, 0, 0);
console.log("Sphere positioned at the center");

// Setup camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = sphereRadiusUnits * 3; // Initial position
camera.lookAt(sphere.position);
console.log("Camera positioned to show the sphere");

// Add zoom controls with min and max zoom
const minZoom = sphereRadiusUnits * 3; // Minimum zoom distance
const maxZoom = sphereRadiusUnits * 20; // Maximum zoom distance

function zoom(event) {
    const delta = event.deltaY;
    let newZoom = camera.position.z + delta * 0.1; // Adjust zoom speed
    
    // Apply zoom limits
    newZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);

    camera.position.z = newZoom;
}

// Add event listener for mouse wheel
document.addEventListener('wheel', zoom);

// Setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
console.log("Renderer setup");

// Add orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add damping for smoother rotation
controls.dampingFactor = 0.25; // Adjust damping factor

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update(); // Update orbit controls
}
animate();
console.log("Rendering scene");

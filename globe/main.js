// main.js

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a plane (representing the map)
const geometry = new THREE.PlaneGeometry(10, 5); // Adjust the width and height as needed
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const map = new THREE.Mesh(geometry, material);
scene.add(map);

// Load GeoJSON data for country outlines
const loader = new THREE.GeoJsonLoader();
loader.load('path/to/countries.geojson', function (geojson) {
  const countries = new THREE.Mesh(
    new THREE.Geometry().fromBufferGeometry(new THREE.BufferGeometry().fromGeometry(geojson)),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
  );
  scene.add(countries);
});

// Position the camera
camera.position.z = 10;

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Animation function
function animate() {
  requestAnimationFrame(animate);

  // Rotate the map slowly
  map.rotation.y += 0.005;

  // Render the scene
  renderer.render(scene, camera);
}

// Start animation
animate();

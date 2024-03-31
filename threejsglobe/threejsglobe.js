// Import OrbitControls from three.js modules
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Initialize Three.js scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Earth
var earthGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Earth radius is approximately 0.5 in arbitrary units
var earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // Blue color for Earth
var earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Create Moon
var moonGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Moon radius is approximately 0.1 in arbitrary units
var moonMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa }); // Gray color for Moon
var moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Set positions
earth.position.set(0, 0, 0); // Earth at the center of the scene
moon.position.set(3, 0, 0); // Moon 3 units away from Earth along the x-axis (scaled distance)

// Set camera position
camera.position.z = 2;

// Add controls
var controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Add ambient light
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

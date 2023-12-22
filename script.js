// Import required Three.js modules
import * as THREE from 'https://threejs.org/build/three.module.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globe-container').appendChild(renderer.domElement);

// Create a sphere
const geometry = new THREE.SphereGeometry(2, 32, 32);
const material = new THREE.LineBasicMaterial({ color: 0x000000 });
const sphere = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), material);
scene.add(sphere);

// Load your country outline data and create line segments for each country
// Example: const countryOutlines = createCountryOutlines();
// Add country outlines as line segments to the scene

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);

    // Add rotation logic here
    sphere.rotation.y += 0.005;

    renderer.render(scene, camera);
};

animate();

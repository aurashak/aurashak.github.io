const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Use SphereGeometry instead of BoxGeometry
const geometry = new THREE.SphereGeometry(2, 32, 32); // Adjusted sphere size and segments
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(geometry, material); // Changed variable name to 'sphere'
scene.add(sphere); // Changed from 'cube' to 'sphere'

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.005;
  sphere.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

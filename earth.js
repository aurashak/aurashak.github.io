// Set up the scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('sphere-container').appendChild(renderer.domElement);

// Create the sphere geometry and mesh, and add it to the scene
var geometry = new THREE.SphereGeometry(5, 32, 32); // SphereGeometry(radius, widthSegments, heightSegments)
var material = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // MeshBasicMaterial with yellow color
var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Set the camera position
camera.position.z = 15;

// Animation loop to render the scene and rotate the sphere
function animate() {
    requestAnimationFrame(animate);

    // Rotate the sphere (optional)
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// Handle window resize events
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Start the animation loop
animate();

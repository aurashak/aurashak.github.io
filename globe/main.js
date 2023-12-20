// Begin script
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// Create a geometry
const geometry = new THREE.BoxGeometry(1, 2, 3);
// Create a material
const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
// Create a mesh
const mesh = new THREE.Mesh(geometry, material);
// Add the mesh to the scene
scene.add(mesh);
// Create a renderer
const renderer = new THREE.WebGLRenderer();
// Set the size
renderer.setSize(window.innerWidth, window.innerHeight);
// Append to the DOM
document.body.appendChild(renderer.domElement);
// Position the camera
camera.position.z = 5;
// Animate the scene
function animate() {
    requestAnimationFrame( animate );
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    renderer.render( scene, camera );
};
animate();
// End script
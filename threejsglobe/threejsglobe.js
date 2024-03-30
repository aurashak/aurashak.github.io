const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);


const textureLoader = new THREE.TextureLoader();
const globeTexture = textureLoader.load('https://aurashak.github.io/threejsglobe/earthtexture2.jpg');

const globeMaterial = new THREE.MeshBasicMaterial({ map: globeTexture });


const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
scene.add(globe);


const light = new THREE.PointLight(0xffffff, 1, 500);
light.position.set(10, 0, 25);
scene.add(light);



function animate() {
    requestAnimationFrame(animate);

    // Rotate the globe
    globe.rotation.y += 0.005;

    renderer.render(scene, camera);
}

animate();



// Assuming you have already initialized your camera and renderer
const controls = new OrbitControls(camera, renderer.domElement);

// Set the center of rotation (the target) to the center of your scene or globe
controls.target.set(0, 0, 0);

// How far you can dolly in and out (PerspectiveCamera only)
controls.minDistance = 2;
controls.maxDistance = 10;

// How far you can orbit vertically, upper and lower limits.
// If you want to prevent the camera from going below the ground:
controls.maxPolarAngle = Math.PI / 2;


function animate() {
    requestAnimationFrame(animate);

    // Required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render(scene, camera);
}


window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});



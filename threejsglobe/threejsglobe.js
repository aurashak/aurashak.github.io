const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);


const textureLoader = new THREE.TextureLoader();
const globeTexture = textureLoader.load('https://aurashak.github.io/threejsglobe/earthtexture.tif');

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


window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});



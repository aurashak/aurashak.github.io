import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const textureLoader = new THREE.TextureLoader();
const globeTexture = textureLoader.load('https://aurashak.github.io/threejsglobe/earthtexture2.jpg'); // Ensure this is a web-compatible format like JPG or PNG

const globeMaterial = new THREE.MeshBasicMaterial({ map: globeTexture });
const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
scene.add(globe);

const light = new THREE.PointLight(0xffffff, 1, 500);
light.position.set(10, 0, 25);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.minDistance = 2;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2;

function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.005; // If you want the globe to keep spinning
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});









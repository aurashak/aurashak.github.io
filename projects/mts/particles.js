document.addEventListener('DOMContentLoaded', init);

function init() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20; // Zoom out more

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.2 });

    const particles = new THREE.Points(particleGeometry, particleMaterial);

    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    scene.add(particles);

    function animate() {
        requestAnimationFrame(animate);

        // Rotate particles based on wind-like movement
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    });

    animate();
}

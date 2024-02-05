document.addEventListener('DOMContentLoaded', init);

function init() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50; // Zoom out more

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.2 });

    const particles = new THREE.Points(particleGeometry, particleMaterial);

    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);

    // Set up particles around a vertical line to simulate smokestack
    for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = Math.random() * 20; // Adjust height

        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    scene.add(particles);

    function animate() {
        requestAnimationFrame(animate);

        // Rotate particles slightly for a dynamic look
        particles.rotation.z += 0.001;

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

// Wait for the DOM to be ready before initializing Three.js
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Set up the scene
    const scene = new THREE.Scene();

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Set up the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Set up particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });

    const particles = new THREE.Points(particleGeometry, particleMaterial);

    // Generate random particles
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Add particles to the scene
    scene.add(particles);

    // Set up animation
    function animate() {
        requestAnimationFrame(animate);

        // Rotate particles
        particles.rotation.x += 0.005;
        particles.rotation.y += 0.005;

        // Render the scene
        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    });

    // Start the animation loop
    animate();
}

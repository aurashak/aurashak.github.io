document.addEventListener('DOMContentLoaded', init);

function init() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50; // Zoom out more

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.2, opacity: 1, transparent: true });

    const particles = new THREE.Points(particleGeometry, particleMaterial);

    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);

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

        scales[i / 3] = 1; // Initial scale
        opacities[i / 3] = 1; // Initial opacity
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    particleGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    scene.add(particles);

    function animate() {
        requestAnimationFrame(animate);

        // Dissipate particles upward and minimize in size and number
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 2] += 0.1; // Move particles upwards

            // Update scale and opacity based on vertical position
            scales[i] = Math.max(0, 1 - positions[i * 3 + 2] / 20);
            opacities[i] = Math.max(0, 1 - positions[i * 3 + 2] / 20);
        }

        particleGeometry.attributes.position.needsUpdate = true;
        particleGeometry.attributes.scale.needsUpdate = true;
        particleGeometry.attributes.opacity.needsUpdate = true;

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

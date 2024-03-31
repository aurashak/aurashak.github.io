        // Setup scene
        const scene = new THREE.Scene();

        // Create cube
        const cubeSize = 300000;
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        scene.add(cube);

        // Create sphere
        const sphereRadius = 7913.5;
        const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        // Position sphere at the center
        sphere.position.set(0, 0, 0);

        // Position camera to show the sphere
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = sphereRadius * 2; // Adjust the distance to properly see the sphere
        camera.lookAt(sphere.position);
        
        // Setup renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Render the scene
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
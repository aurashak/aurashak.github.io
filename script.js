document.addEventListener('DOMContentLoaded', function () {
    // Set up the scene, camera, and renderer
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    // Append renderer's dom element to cube-container
    document.getElementById('cube-container').appendChild(renderer.domElement);
  
    // Create a sphere with a solid gray material
    var initialSphereSize = 2; // Adjust the size as needed
    var geometry = new THREE.SphereGeometry(initialSphereSize, 32, 32);
    var material = new THREE.MeshPhongMaterial({ color: 0x888888 });
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  
    // Add a directional light
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
  
    // Create graticule lines
    var graticule = new THREE.Object3D();
    var graticuleSpacing = 0.1; // Adjust spacing as needed
  
    // Vertical lines
    for (let i = -1; i <= 1; i += graticuleSpacing) {
      var verticalGeometry = new THREE.BufferGeometry();
      var verticalMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      verticalGeometry.setAttribute('position', new THREE.Float32BufferAttribute([i, -1, 0, i, 1, 0], 3));
      var verticalLine = new THREE.Line(verticalGeometry, verticalMaterial);
      graticule.add(verticalLine);
    }
  
    // Horizontal lines
    for (let i = -1; i <= 1; i += graticuleSpacing) {
      var horizontalGeometry = new THREE.BufferGeometry();
      var horizontalMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      horizontalGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, i, 0, 1, i, 0], 3));
      var horizontalLine = new THREE.Line(horizontalGeometry, horizontalMaterial);
      graticule.add(horizontalLine);
    }
  
    scene.add(graticule);
  
    // Set up the camera position
    camera.position.z = 5;
  
    // Define an animation function
    var animate = function () {
      requestAnimationFrame(animate);
  
      // Rotate the sphere
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
  
      // Render the scene
      renderer.render(scene, camera);
    };
  
    // Handle window resize
    window.addEventListener('resize', function () {
      var newWidth = window.innerWidth;
      var newHeight = window.innerHeight;
  
      // Update camera aspect ratio and renderer size
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
  
    // Start the animation
    animate();
  });
  
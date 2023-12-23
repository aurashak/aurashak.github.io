document.addEventListener('DOMContentLoaded', function () {
    // Set up the scene, camera, and renderer
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    // Append renderer's dom element to cube-container
    document.getElementById('cube-container').appendChild(renderer.domElement);
  
    // Create a sphere with a solid gray material
    var geometry = new THREE.SphereGeometry(5, 32, 32); // Increase the size and segmentation
    var material = new THREE.MeshPhongMaterial({ color: 0x888888, wireframe: false });
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  
    // Add a directional light
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
  
    // Set up the camera position
    camera.position.z = 15;
  
    // Enable manual rotation with right-click
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true;
    controls.enableZoom = true;
  
    // Create graticule lines every 10 degrees
    var graticuleMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    var graticuleGeometry = new THREE.BufferGeometry();
    var graticulePoints = [];
    var graticuleRadius = 5;
  
    for (let i = 0; i <= 36; i++) {
      var theta = (i / 36) * Math.PI * 2;
      var x = graticuleRadius * Math.cos(theta);
      var y = graticuleRadius * Math.sin(theta);
  
      graticulePoints.push(new THREE.Vector3(x, y, 0));
    }
  
    graticuleGeometry.setFromPoints(graticulePoints);
  
    var graticule = new THREE.Line(graticuleGeometry, graticuleMaterial);
    scene.add(graticule);
  
    // Define an animation function
    var animate = function () {
      requestAnimationFrame(animate);
  
      // Rotate the sphere
      sphere.rotation.y += 0.005;
  
      // Render the scene
      renderer.render(scene, camera);
    };
  
    // Start the animation
    animate();
  });
  
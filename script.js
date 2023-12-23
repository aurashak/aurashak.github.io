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
  
    // Start the animation
    animate();
  });
  
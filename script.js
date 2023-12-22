document.addEventListener('DOMContentLoaded', function () {
    // Set up the scene, camera, and renderer
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    // Corrected ID here: 'cube-container'
    document.getElementById('cube-container').appendChild(renderer.domElement);
  
    // Create a cube
    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  
    // Position the camera
    camera.position.z = 5;
  
    // Define an animation function
    var animate = function () {
      requestAnimationFrame(animate);
  
      // Rotate the cube
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
  
      // Render the scene
      renderer.render(scene, camera);
    };
  
    // Start the animation
    animate();
  });
  
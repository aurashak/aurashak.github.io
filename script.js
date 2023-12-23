<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; }
    #cube-container { position: absolute; top: 0; left: 0; }
  </style>
</head>
<body>

  <div id="cube-container"></div>

  <script src="https://threejs.org/build/three.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      // Set up the scene, camera, and renderer
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      var renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Append renderer's dom element to cube-container
      document.getElementById('cube-container').appendChild(renderer.domElement);

      // Create a sphere with a solid gray material
      var geometry = new THREE.SphereGeometry(2, 32, 32); // Increase the size and segments for a smoother sphere
      var material = new THREE.MeshPhongMaterial({ color: 0x888888 });
      var sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Position the sphere
      sphere.position.set(0, 0, 0);

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
  </script>
</body>
</html>

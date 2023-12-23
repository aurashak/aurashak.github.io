document.addEventListener('DOMContentLoaded', function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    document.getElementById('cube-container').appendChild(renderer.domElement);
  
    var initialSphereSize = 2;
    var geometry = new THREE.SphereGeometry(initialSphereSize, 32, 32);
    var material = new THREE.MeshPhongMaterial({ color: 0x888888 });
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
  
    var graticule = new THREE.Object3D();
    var graticuleSpacing = 0.1;
  
    for (let i = -1; i <= 1; i += graticuleSpacing) {
      var verticalGeometry = new THREE.BufferGeometry();
      var verticalMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      verticalGeometry.setAttribute('position', new THREE.Float32BufferAttribute([i, -1, 0, i, 1, 0], 3));
      var verticalLine = new THREE.Line(verticalGeometry, verticalMaterial);
      graticule.add(verticalLine);
  
      var horizontalGeometry = new THREE.BufferGeometry();
      var horizontalMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      horizontalGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, i, 0, 1, i, 0], 3));
      var horizontalLine = new THREE.Line(horizontalGeometry, horizontalMaterial);
      graticule.add(horizontalLine);
    }
  
    scene.add(graticule);
  
    camera.position.z = 5;
  
    var mouseDown = false;
    var mouseX = 0;
    var mouseY = 0;
  
    document.addEventListener('mousedown', function (event) {
      mouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    });
  
    document.addEventListener('mouseup', function () {
      mouseDown = false;
    });
  
    document.addEventListener('mousemove', function (event) {
      if (mouseDown) {
        var deltaX = event.clientX - mouseX;
        var deltaY = event.clientY - mouseY;
  
        sphere.rotation.y += deltaX * 0.01;
        sphere.rotation.x += deltaY * 0.01;
  
        mouseX = event.clientX;
        mouseY = event.clientY;
      }
    });
  
    window.addEventListener('resize', function () {
      var newWidth = window.innerWidth;
      var newHeight = window.innerHeight;
  
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
  
    var animate = function () {
      requestAnimationFrame(animate);
  
      renderer.render(scene, camera);
    };
  
    animate();
  });
  
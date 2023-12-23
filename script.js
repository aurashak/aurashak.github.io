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
    var graticuleSpacing = 10;

    // Latitude lines
    for (let lat = -90; lat <= 90; lat += graticuleSpacing) {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([-180, lat, 0, 180, lat, 0], 3));
        const latLine = new THREE.Line(geometry, material);
        graticule.add(latLine);
    }

    // Longitude lines
    for (let lon = -180; lon <= 180; lon += graticuleSpacing) {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([lon, -90, 0, lon, 90, 0], 3));
        const lonLine = new THREE.Line(geometry, material);
        graticule.add(lonLine);
    }

    // Add black lines along the x and y axes
    var xAxisGeometry = new THREE.BufferGeometry();
    var xAxisMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    xAxisGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 0, 0, 1, 0, 0], 3));
    var xAxisLine = new THREE.Line(xAxisGeometry, xAxisMaterial);
    graticule.add(xAxisLine);

    var yAxisGeometry = new THREE.BufferGeometry();
    var yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    yAxisGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, -1, 0, 0, 1, 0], 3));
    var yAxisLine = new THREE.Line(yAxisGeometry, yAxisMaterial);
    graticule.add(yAxisLine);

    scene.add(graticule);

    camera.position.z = 5;

    var mouseDown = false;
    var mouseX = 0;
    var mouseY = 0;

    document.addEventListener('

// Setup for Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3dViewer').appendChild(renderer.domElement);

// Orbit Controls for interactivity
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Dim ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Load textures for wood
const textureLoader = new THREE.TextureLoader();
const woodTextures = [
    textureLoader.load('https://dudespec.github.io/3d-product-viewer/textures/Black_Walnut.jpg'),
    textureLoader.load('https://dudespec.github.io/3d-product-viewer/textures/burl1.jpg'),
    textureLoader.load('https://dudespec.github.io/3d-product-viewer/textures/burl2.jpg'),
    textureLoader.load('https://dudespec.github.io/3d-product-viewer/textures/Hickory.jpg'),
    textureLoader.load('https://dudespec.github.io/3d-product-viewer/textures/Mahogany.jpg'),
    textureLoader.load('https://dudespec.github.io/3d-product-viewer/textures/Oak.jpg'),
    textureLoader.load('https://dudespec.github.io/3d-product-viewer/textures/Purpleheart.jpg')
];

// Load model using GLTFLoader
const loader = new THREE.GLTFLoader();
let model;

loader.load('https://dudespec.github.io/3d-product-viewer/models/Ratchet.gltf', function(gltf) {
    model = gltf.scene;
    model.scale.set(10, 10, 10); // Scale up the model (adjust as needed)
    scene.add(model);
    camera.position.set(0, 3, 10); // Move camera further away for better view
    controls.target.set(0, 3, 0); // Set the point of rotation
    render();
});

// Function to update material for a specific part based on texture index
function updatePartMaterial(partName, textureIndex) {
    if (model) {
        const part = model.getObjectByName(partName);
        if (part && part.isMesh) {
            part.material.map = woodTextures[textureIndex];
            part.material.needsUpdate = true;
        }
    }
}

// Function to update titanium color for parts
function updateTitaniumMaterial(colorIndex) {
    const titaniumColor = new THREE.Color();
    switch (colorIndex) {
        case 0:
            titaniumColor.setHex(0x4b4e6d); // Titanium color 1
            break;
        case 1:
            titaniumColor.setHex(0x4f7a89); // Titanium color 2
            break;
        case 2:
            titaniumColor.setHex(0x3d4f5c); // Titanium color 3
            break;
        case 3:
            titaniumColor.setHex(0x627d83); // Titanium color 4
            break;
        case 4:
            titaniumColor.setHex(0x5c6f71); // Titanium color 5
            break;
    }

    const titaniumParts = [
        'Top Plate 1', 'Top Plate 2', 'Top Plate 3', 'Top Handle Nut', 'Top Handle Bolt',
        'Center Handle Nut', 'Center Handle Bolt', 'Bottom Handle Nut', 'Bottom Handle Bolt',
        'Cover Plate', 'Cover Plate Screw L', 'Cover Plate Screw R', 'Center', 'Bottom Plate 1', 'Bottom Plate 2'
    ];

    titaniumParts.forEach(partName => {
        const part = model.getObjectByName(partName);
        if (part) {
            part.material.color = titaniumColor;
            part.material.needsUpdate = true;
        }
    });
}

// Event listeners for dropdown menus
document.getElementById('handleTopWood').addEventListener('change', function(event) {
    const textureIndex = parseInt(event.target.value);
    updatePartMaterial('Handle Top', textureIndex);
});

document.getElementById('handleBottomWood').addEventListener('change', function(event) {
    const textureIndex = parseInt(event.target.value);
    updatePartMaterial('Handle Bottom', textureIndex);
});

// Add more event listeners for other parts...

document.getElementById('titaniumOption').addEventListener('change', function(event) {
    const colorIndex = parseInt(event.target.value);
    updateTitaniumMaterial(colorIndex);
});

// Render loop
function render() {
    requestAnimationFrame(render);
    controls.update();  // Update controls for rotation
    renderer.render(scene, camera);
}
</script>
</body>
</html>

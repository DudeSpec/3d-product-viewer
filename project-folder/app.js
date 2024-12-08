// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls to allow camera movement
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1, 5);  // Start position of the camera
controls.update();

// Lighting setup
const light = new THREE.AmbientLight(0x404040, 5); // Ambient light
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Load the Ratchet model using GLTFLoader
const loader = new THREE.GLTFLoader();
let model;
loader.load('models/Ratchet.glb', function(gltf) {
    model = gltf.scene;
    scene.add(model);
    render();
});

// Wood textures
const woodTextures = [
    new THREE.TextureLoader().load('textures/Black_Walnut.jpg'),
    new THREE.TextureLoader().load('textures/burl1.jpg'),
    new THREE.TextureLoader().load('textures/burl2.jpg'),
    new THREE.TextureLoader().load('textures/Hickory.jpg'),
    new THREE.TextureLoader().load('textures/Mahogany.jpg'),
    new THREE.TextureLoader().load('textures/Oak.jpg'),
    new THREE.TextureLoader().load('textures/Purpleheart.jpg')
];

// Function to update wood texture
function updateWoodMaterial(textureIndex) {
    model.traverse(function(child) {
        if (child.isMesh) {
            if (child.name.includes('Handle') || child.name.includes('Case')) {
                child.material.map = woodTextures[textureIndex];
                child.material.needsUpdate = true;
            }
        }
    });
}

// Titanium anodization colors (based on color index)
function setTitaniumColor(partName, anodizationIndex) {
    let anodizedColor;
    switch (anodizationIndex) {
        case 0: anodizedColor = new THREE.Color(1, 1, 1); break; // Natural
        case 1: anodizedColor = new THREE.Color(0.3, 0.4, 1); break; // Blue
        case 2: anodizedColor = new THREE.Color(0.6, 0.3, 0.1); break; // Bronze
        case 3: anodizedColor = new THREE.Color(1, 0.8, 0); break; // Gold
        case 4: anodizedColor = new THREE.Color(0.5, 0, 1); break; // Purple
        case 5: anodizedColor = new THREE.Color(0.2, 0.2, 0.2); break; // Black
        default: anodizedColor = new THREE.Color(1, 1, 1); break; // Default to natural
    }

    model.traverse(function(child) {
        if (child.isMesh && child.name === partName) {
            child.material.color.set(anodizedColor);
            child.material.needsUpdate = true;
        }
    });
}

// Event listeners for UI selection
document.getElementById('woodOption').addEventListener('change', function(event) {
    const textureIndex = parseInt(event.target.value);
    updateWoodMaterial(textureIndex);
});

document.getElementById('titaniumOption').addEventListener('change', function(event) {
    const anodizationIndex = parseInt(event.target.value);
    const titaniumParts = [
        'Top Plate 1', 'Top Plate 2', 'Top Plate 3', 
        'Top Handle Nut', 'Top Handle Bolt', 'Center Handle Nut', 
        'Center Handle Bolt', 'Bottom Handle Nut', 'Bottom Handle Bolt', 
        'Cover Plate', 'Cover Plate Screw L', 'Cover Plate Screw R', 
        'Center', 'Bottom Plate 1', 'Bottom Plate 2'
    ];
    titaniumParts.forEach(partName => setTitaniumColor(partName, anodizationIndex));
});

// Animation loop
function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resizing for mobile responsiveness
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

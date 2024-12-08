// Import required modules from Three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// Base URL for GitHub-hosted assets
const BASE_URL = "https://dudespec.github.io/3d-product-viewer";

// Initialize Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Load Model
const loader = new GLTFLoader();
let ratchetModel;

loader.load(
    `${BASE_URL}/models/Ratchet.gltf`,
    (gltf) => {
        ratchetModel = gltf.scene;
        scene.add(ratchetModel);
        logModelHierarchy(ratchetModel); // Log the hierarchy for debugging
        animate();
    },
    undefined,
    (error) => {
        console.error('Error loading model:', error);
    }
);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Function to Change Texture
function changeTexture(partName, texturePath) {
    const texture = textureLoader.load(`${BASE_URL}/textures/${texturePath}`);
    ratchetModel.traverse((object) => {
        // Ensure the object is a Mesh and has a valid material
        if (object.isMesh && object.material && object.material.name === partName) {
            object.material.map = texture;
            object.material.needsUpdate = true;
        }
    });
}

// Function to Change Color
function changeColor(partName, hexColor) {
    ratchetModel.traverse((object) => {
        // Ensure the object is a Mesh and has a valid material
        if (object.isMesh && object.material && object.material.name === partName) {
            object.material.color.setHex(hexColor);
            object.material.needsUpdate = true;
        }
    });
}

// Function to Log the Model's Hierarchy for Debugging
function logModelHierarchy(model) {
    model.traverse((object) => {
        console.log(`Name: ${object.name}, Type: ${object.type}`);
        if (object.material) {
            console.log(`  Material Name: ${object.material.name}`);
        }
    });
}

// UI Interaction Logic
document.getElementById('handle-top-texture').addEventListener('change', (event) => {
    const selectedTexture = event.target.value;
    changeTexture('Handle Top', selectedTexture);
});

document.getElementById('bottom-handle-bolt-color').addEventListener('input', (event) => {
    const selectedColor = event.target.value.replace('#', '0x');
    changeColor('Bottom Handle Bolt', selectedColor);
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

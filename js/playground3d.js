// Entry point for immersive 3D playground


import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/postprocessing/UnrealBloomPass.js';

export function initPlayground3D() {
    const container = document.getElementById('playground-3d');
    if (!container) return;

    // Scene setup

    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(70, container.offsetWidth / container.offsetHeight, 0.1, 100);
    camera.position.set(0, 5, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Postprocessing for bloom/glow
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(container.offsetWidth, container.offsetHeight),
        1.1, 0.7, 0.01
    );
    composer.addPass(bloomPass);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Subtle gradient background (fake with large sphere)
    const bgGeo = new THREE.SphereGeometry(60, 64, 64);
    const bgMat = new THREE.MeshBasicMaterial({
        color: 0x232946,
        side: THREE.BackSide
    });
    const bgSphere = new THREE.Mesh(bgGeo, bgMat);
    bgSphere.position.set(0, 5, 0);
    scene.add(bgSphere);

    // Glassy background plane

    const glassGeo = new THREE.PlaneGeometry(40, 24);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.22,
        roughness: 0.05,
        metalness: 0.4,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        transmission: 0.95,
        ior: 1.5,
        thickness: 3,
        envMapIntensity: 1.5,
        sheen: 1,
        sheenColor: new THREE.Color(0x8ecae6),
        sheenRoughness: 0.2
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 5, -2);
    scene.add(glass);

    // Onion pathway: concentric glassy spheres (layers)

    const onionLayers = 5;
    const onionMeshes = [];
    for (let i = 1; i <= onionLayers; ++i) {
        const onionGeo = new THREE.SphereGeometry(2.5 + i * 1.5, 64, 64);
        const onionMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(0.58 + i * 0.04, 0.7, 0.7),
            transparent: true,
            opacity: 0.11 + i * 0.04,
            roughness: 0.05,
            metalness: 0.4,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            transmission: 0.92,
            ior: 1.4 + i * 0.04,
            thickness: 1.2 + i * 0.3,
            envMapIntensity: 1.3,
            sheen: 1,
            sheenColor: new THREE.Color(0x74b9ff),
            sheenRoughness: 0.15
        });
        const onion = new THREE.Mesh(onionGeo, onionMat);
        onion.position.set(0, 5, 0);
        onion.userData = { layer: i };
        scene.add(onion);
        onionMeshes.push(onion);
    }

    // Smart bubbles: only for learned topics/problems
    // Example: simulate learned problems from localStorage (replace with real logic)
    let learnedProblems = [
        { topic: 'Arrays', url: 'https://leetcode.com/problems/two-sum/' },
        { topic: 'Trees', url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
        { topic: 'Sorting', url: 'https://leetcode.com/problems/sort-an-array/' }
    ];
    // TODO: Replace above with real progress fetch

    // Bubbles float up from bottom, respawn at bottom after leaving top

    // Bubble glow material
    function createBubbleMaterial() {
        return new THREE.MeshPhysicalMaterial({
            color: 0xa29bfe,
            transparent: true,
            opacity: 0.82,
            roughness: 0.04,
            metalness: 0.4,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            transmission: 0.98,
            ior: 1.25,
            thickness: 0.7,
            envMapIntensity: 1.7,
            sheen: 1,
            sheenColor: new THREE.Color(0xe0c3fc),
            sheenRoughness: 0.1
        });
    }

    // Bubble label font
    let font = null;
    const bubbles = [];
    const fontLoader = new FontLoader();
    fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.153.0/examples/fonts/helvetiker_regular.typeface.json', loadedFont => {
        font = loadedFont;
        learnedProblems.forEach((data, i) => {
            const geo = new THREE.SphereGeometry(0.7, 32, 32);
            const mat = createBubbleMaterial();
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                Math.sin(i * 2.1) * 4 + (Math.random() - 0.5) * 1.5,
                -4 + Math.random() * 2,
                Math.cos(i * 2.1) * 4 + (Math.random() - 0.5) * 1.5
            );
            mesh.userData = data;
            scene.add(mesh);
            // Add glowing outline
            const outlineGeo = new THREE.SphereGeometry(0.74, 32, 32);
            const outlineMat = new THREE.MeshBasicMaterial({ color: 0x8ecae6, transparent: true, opacity: 0.45 });
            const outline = new THREE.Mesh(outlineGeo, outlineMat);
            outline.position.copy(mesh.position);
            mesh.add(outline);
            // Add floating label
            if (font) {
                const textGeo = new TextGeometry(data.topic, {
                    font: font,
                    size: 0.22,
                    height: 0.04
                });
                const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const textMesh = new THREE.Mesh(textGeo, textMat);
                textMesh.position.set(-0.5, 0.95, 0);
                mesh.add(textMesh);
            }
            bubbles.push(mesh);
        });
    });

    // Animate bubbles upward

    function animateBubbles(time) {
        bubbles.forEach((b, i) => {
            b.position.y += 0.018 + Math.sin(time / 900 + i) * 0.008;
            b.rotation.y += 0.01;
            if (b.position.y > 8) {
                b.position.y = -4;
                b.position.x = Math.sin(i * 2.1 + time / 2000) * 4 + (Math.random() - 0.5) * 1.5;
                b.position.z = Math.cos(i * 2.1 + time / 2000) * 4 + (Math.random() - 0.5) * 1.5;
            }
            // Animate label and outline
            if (b.children.length > 0) {
                b.children.forEach(child => {
                    child.position.y = 0.05 + Math.sin(time / 400 + i) * 0.08;
                });
            }
        });
    }

    // Bubble click interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    renderer.domElement.addEventListener('pointerdown', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(bubbles);
        if (intersects.length > 0) {
            const bubble = intersects[0].object;
            // Bubble burst effect (fade out, then respawn)
            bubble.visible = false;
            setTimeout(() => {
                bubble.visible = true;
                bubble.position.y = -4;
            }, 600);
            // Redirect to LeetCode problem
            window.open(bubble.userData.url, '_blank');
        }
    });


    // Onion layer hover/click interaction (visual feedback)
    renderer.domElement.addEventListener('pointermove', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(onionMeshes);
        onionMeshes.forEach(layer => {
            layer.material.emissive = new THREE.Color(0x000000);
        });
        if (intersects.length > 0) {
            const hovered = intersects[0].object;
            hovered.material.emissive = new THREE.Color(0x8ecae6);
        }
    });

    renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(onionMeshes);
        if (intersects.length > 0) {
            const clicked = intersects[0].object;
            // Show overlay or tooltip for this layer (simulate learning info)
            showOverlay(`Layer ${clicked.userData.layer}: Unlock new concepts!`);
        }
    });

    // Overlay for learning guidance
    let overlayDiv = null;
    function showOverlay(text) {
        if (!overlayDiv) {
            overlayDiv = document.createElement('div');
            overlayDiv.style.position = 'absolute';
            overlayDiv.style.top = '30px';
            overlayDiv.style.left = '50%';
            overlayDiv.style.transform = 'translateX(-50%)';
            overlayDiv.style.background = 'rgba(35,41,70,0.92)';
            overlayDiv.style.color = '#fff';
            overlayDiv.style.padding = '18px 36px';
            overlayDiv.style.borderRadius = '18px';
            overlayDiv.style.fontSize = '1.3rem';
            overlayDiv.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
            overlayDiv.style.zIndex = '1000';
            overlayDiv.style.backdropFilter = 'blur(8px)';
            overlayDiv.style.pointerEvents = 'none';
            document.body.appendChild(overlayDiv);
        }
        overlayDiv.textContent = text;
        overlayDiv.style.opacity = '1';
        setTimeout(() => {
            if (overlayDiv) overlayDiv.style.opacity = '0';
        }, 1800);
    }

    // Render loop
    function animate(time) {
        animateBubbles(time || 0);
        composer.render();
        requestAnimationFrame(animate);
    }
    animate();
}

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Set background to sky blue
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Softer ambient light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Brighter directional light
directionalLight.position.set(-50, 50, 50); // Positioned to simulate a sun in the top left
scene.add(directionalLight);

// Adding a sun visual
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffee00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(-50, 50, 50);
scene.add(sun);

// Runway with white lines
const runwayGeometry = new THREE.BoxGeometry(50, 1, 300);
const runwayMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
const runway = new THREE.Mesh(runwayGeometry, runwayMaterial);
runway.position.set(0, -0.5, 0);
scene.add(runway);

// White lines on the runway (Central Strip)
for (let i = 0; i < runwayGeometry.parameters.depth; i += 20) {
    const stripeGeometry = new THREE.PlaneGeometry(2, 10);
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(0, 0.1, i - 150);
    runway.add(stripe);
}

// Grass field
const grassGeometry = new THREE.PlaneGeometry(1000, 1000);
const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.rotation.x = -Math.PI / 2;
grass.position.y = -0.5;
scene.add(grass);

// Trees
function createTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 2.5, z);

    const foliageGeometry = new THREE.SphereGeometry(4, 16, 16);
    const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(x, 7, z);

    scene.add(trunk);
    scene.add(foliage);
}

// Adding random trees around the runway
const treePositions = [
    {x: 30, z: -50}, {x: -30, z: 50}, {x: 60, z: -150}, {x: -60, z: 150},
    {x: 90, z: -250}, {x: -90, z: 250}, {x: 100, z: -100}, {x: -100, z: 100},
    {x: 120, z: 50}, {x: -120, z: -50}, {x: 150, z: 200}, {x: -150, z: -200},
    {x: 130, z: -100}, {x: -130, z: 100}, {x: 140, z: 150}, {x: -140, z: -150}
];
treePositions.forEach(pos => createTree(pos.x, pos.z));

// Airplane components scaled up
const fuselageGeometry = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
const fuselageMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
fuselage.rotation.z = Math.PI / 2;
fuselage.position.set(0, 2, -150);

const wingGeometry = new THREE.BoxGeometry(20, 0.2, 4);
const wingMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const wings = new THREE.Mesh(wingGeometry, wingMaterial);
wings.position.set(0, 2, -150);

const tailGeometry = new THREE.BoxGeometry(2, 3, 0.2);
const tailMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const tail = new THREE.Mesh(tailGeometry, tailMaterial);
tail.position.set(0, 5, -156);

const airplane = new THREE.Group();
airplane.add(fuselage);
airplane.add(wings);
airplane.add(tail);
scene.add(airplane);

// Camera closer to the airplane for a detailed view
camera.position.set(-50, 15, -145);
camera.lookAt(airplane.position);

// Animation
let takeoffStarted = false;
function animate() {
    requestAnimationFrame(animate);

    airplane.position.z += 0.1; // Slower movement
    if (!takeoffStarted) {
        camera.position.z += 0.1;
    }
    
    if (airplane.position.z > 10 && !takeoffStarted) {
        takeoffStarted = true;
    }

    if (takeoffStarted) {
        airplane.position.y += 0.02; // Slower ascent
        camera.position.y += 0.02;
    }

    camera.lookAt(airplane.position);
    renderer.render(scene, camera);
}

animate();
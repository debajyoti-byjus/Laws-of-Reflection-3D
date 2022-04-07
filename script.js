import * as THREE from "./js/three.module.js";
// // console.log(THREE);
import { GLTFLoader } from './js/GLTFLoader.js';
import { OrbitControls } from './js/OrbitControls.js';
import { Reflector } from './js/Reflector.js';

import { EffectComposer } from './js/EffectComposer.js';
import { RenderPass } from './js/RenderPass.js';

// import { InfiniteGridHelper } from "./js/InfiniteGridHelper.js";
// import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';


const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
// this._composer = new EffectComposer(._threejs);

let raylength = 4, m = 1, n = 1, radiusRatio = 0.6;
// let arrow1Radius = 1, arrow2Radius = 1.1, beamCentreRadius = 1, laserPointerRadius = 4;
let arrow1Radius = 2, arrow2Radius = 2.2, beamCentreRadius = 2, laserPointerRadius = 5.25, normalOpacity = 0.4, planeOpacity = 0.1, angleArcOpacity = normalOpacity;

let sceneShiftX = -3;

let root1, root2, root3, laserModel, greenCuttingBoard, arrowModel2, arrowModel, scaleval = 0.8;
let roughness0 = 0, transmission1 = 0.9, thick1 = 0;
let tag;
let root1Material;
// loading
const loader = new GLTFLoader();

//-------------LASER Pointer ----------------
loader.load("./assets/3D models glb/scene.glb", function (glb) {
    laserModel = glb.scene;
    laserModel.position.set(laserPointerRadius + sceneShiftX, 0, 0);
    laserModel.scale.set(0.003, 0.003, 0.003);
    laserModel.rotation.set(0, 0, 0);
    // laserModel.children[0].material = new THREE.MeshPhongMaterial({ color: 'red' });
    scene.add(laserModel);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%loaded");
}, function (error) {
    console.log(`An error occured`);
});

//-----------Incident Laser Beam-----------------
const geometryIncidentBeam = new THREE.CylinderGeometry(0.06, 0.06, beamCentreRadius * 2, 32);
const materialIncidentBeam = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 0 });
const cylinderIncidentBeam = new THREE.Mesh(geometryIncidentBeam, materialIncidentBeam);
cylinderIncidentBeam.position.set(beamCentreRadius + sceneShiftX, 0, 0);
cylinderIncidentBeam.scale.set(1, 1, 1);
cylinderIncidentBeam.rotation.set(0, 0, Math.PI / 2);
scene.add(cylinderIncidentBeam);

//-----------Incident Laser Beam Arrow-----------------
loader.load("./assets/3D models glb/arrow.glb", function (glb) {
    arrowModel = glb.scene;
    arrowModel.position.set(arrow1Radius + sceneShiftX, 0, 0);
    arrowModel.scale.set(.5, .5, .5);
    arrowModel.rotation.set(0, 0, Math.PI / 2);
    arrowModel.children[0].material = new THREE.MeshBasicMaterial({ color: 'red' });
    // arrowModel.children[0].material.flatshading = false;
    // console.log();
    scene.add(arrowModel);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%loaded");
}, function (error) {
    console.log(`An error occured`);
});

//-----------Reflected Laser Beam Arrow-----------------
loader.load("./assets/3D models glb/arrow.glb", function (glb) {
    arrowModel2 = glb.scene;
    arrowModel2.position.set(arrow2Radius + sceneShiftX, 0, 0);
    arrowModel2.scale.set(.5, .5, .5);
    arrowModel2.rotation.set(0, Math.PI, Math.PI / 2);
    arrowModel2.children[0].material = new THREE.MeshBasicMaterial({ color: 'red' });
    scene.add(arrowModel2);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%loaded");
}, function (error) {
    console.log(`An error occured`);
});

//-----------Refracted Laser Beam-----------------
const geometryRefractedBeam = new THREE.CylinderGeometry(0.06, 0.06, beamCentreRadius * 2, 32);
const materialRefractedBeam = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 0 });
const cylinderRefractedBeam = new THREE.Mesh(geometryRefractedBeam, materialRefractedBeam);
cylinderRefractedBeam.position.set(beamCentreRadius + sceneShiftX, 0, 0);
cylinderRefractedBeam.scale.set(1, 1, 1);
cylinderRefractedBeam.rotation.set(0, 0, Math.PI / 2);
scene.add(cylinderRefractedBeam);


//-------------Green Cutting Board----------------
loader.load("./assets/3D models glb/greenBoardFinal.glb", function (glb) {
    greenCuttingBoard = glb.scene;
    greenCuttingBoard.position.set(4 + sceneShiftX, -2, 0);
    greenCuttingBoard.scale.set(6.5, 6.5, 6.5);
    greenCuttingBoard.rotation.set(0, 0, 0);
    // greenCuttingBoard.children[0].material = new THREE.MeshPhongMaterial({ color: 'red' });
    scene.add(greenCuttingBoard);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%loaded");
}, function (error) {
    console.log(`An error occured`);
});


//-------------Mirror----------------
const geometry = new THREE.PlaneGeometry(1, 1);

// let plane = new Reflector(geometry, {
//     clipBias: 0,
//     textureWidth: window.innerWidth * window.devicePixelRatio,
//     textureHeight: window.innerHeight * window.devicePixelRatio,
//     color: 0x777777
// });

const material = new THREE.MeshPhysicalMaterial({
    reflectivity: 1.0,
    transmission: 1,
    roughness: 0,
    metalness: 0,
    clearcoat: 0.0,
    clearcoatRoughness: 0,
    color: new THREE.Color("#777777"),
    ior: 1.5,
});
const plane = new THREE.Mesh(geometry, material);
plane.scale.set(3, 7, 1);
plane.rotation.set(Math.PI / 2, Math.PI / 2, 0);
plane.position.set(0 + sceneShiftX, 0, 0);
scene.add(plane);

//----------------------------Mirror Cube------------------------
let geometry1 = new THREE.BoxGeometry(0.05, 3.1, 7.1);
let material1 = new THREE.MeshLambertMaterial({ color: "#222222" });

let mirrorBack = new THREE.Mesh(geometry1, material1);
mirrorBack.position.set(-0.03 + sceneShiftX, 0, 0)
scene.add(mirrorBack);
//----------------------------Mirror Cube Ends------------------------


//----------Creating the transparent plane of reflection-------------
const geometryPlane = new THREE.PlaneGeometry(1, 1);
const materialPlane = new THREE.MeshPhongMaterial({ color: "#555555", side: THREE.DoubleSide, opacity: planeOpacity, transparent: true });
let reflectionPlane = new THREE.Mesh(geometryPlane, materialPlane);
reflectionPlane.scale.set(3, 5, 1);
reflectionPlane.rotation.set(Math.PI / 2, 0, 0);
reflectionPlane.position.set(1.5 + sceneShiftX, 0, 0);
scene.add(reflectionPlane);

//----------Creating the Normal-------------
const geometrynormal = new THREE.CylinderGeometry(0.06, 0.06, beamCentreRadius * 1.67, 32);
const materialnormal = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: "lightblue", shininess: 0, opacity: normalOpacity, transparent: true });
let normal = new THREE.Mesh(geometrynormal, materialnormal);
normal.scale.set(0.9, 0.9, 0.9);
normal.rotation.set(0, 0, Math.PI / 2);
normal.position.set(1.5 + sceneShiftX, 0, 0);
scene.add(normal);


//Test object -  it lies in the centre of the mirrow where the two rays meet(for making a seamless contact)
const geometry2 = new THREE.SphereGeometry(.06, 20, 20);
const material2 = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 0 });
let testObject = new THREE.Mesh(geometry2, material2);
testObject.position.set(0 + sceneShiftX, 0, 0);
scene.add(testObject);

//Create an initial arc here
let arcgeometry = new THREE.TorusGeometry(10, 3, 16, 100);
let arcmaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, opacity: 0, transparent: true });
let arc = new THREE.Mesh(arcgeometry, arcmaterial);
scene.add(arc);

//Create an initial 2nd arc here
let arcgeometry2 = new THREE.TorusGeometry(10, 3, 16, 100);
let arcmaterial2 = new THREE.MeshBasicMaterial({ color: 0xffff00, opacity: 0, transparent: true });
let arc2 = new THREE.Mesh(arcgeometry2, arcmaterial2);
scene.add(arc2);

//-------LASER position wrt slider --------------
function laserPointer() {
    // arrow1Radius = 1, arrow2Radius = 1.1, beamCentreRadius = 1, laserPointerRadius = 4;

    //takes the slider value and rotates/repositions the pointer
    let sliderval = document.getElementById("myRange").value;
    let x, z, theta;
    theta = sliderval;
    x = laserPointerRadius * Math.cos(theta);
    z = laserPointerRadius * Math.sin(theta);

    laserModel.position.set(x + sceneShiftX, 0, z);
    laserModel.rotation.set(0, -theta, 0);
    let xLaserStart = beamCentreRadius * Math.cos(theta);
    let zLaserStart = beamCentreRadius * Math.sin(theta);

    let xArrow = arrow1Radius * Math.cos(theta);
    let zArrow = arrow1Radius * Math.sin(theta);

    cylinderIncidentBeam.position.set(xLaserStart + sceneShiftX, 0, zLaserStart);
    cylinderIncidentBeam.rotation.set(0, -theta, Math.PI / 2);

    arrowModel.position.set(xArrow + sceneShiftX, 0, zArrow);
    arrowModel.rotation.set(0, -theta, Math.PI / 2);

    cylinderRefractedBeam.position.set(xLaserStart + sceneShiftX, 0, -zLaserStart);
    cylinderRefractedBeam.rotation.set(0, theta, Math.PI / 2);

    xArrow = arrow2Radius * Math.cos(theta);
    zArrow = arrow2Radius * Math.sin(theta);

    arrowModel2.position.set(xArrow + sceneShiftX, 0, -zArrow);
    arrowModel2.rotation.set(0, theta - Math.PI, Math.PI / 2);
    // let arrow1Radius = 2, arrow2Radius = 2.2, beamCentreRadius = 2, laserPointerRadius = 5.25;

    //Create Angle Arcs
    scene.remove(arc);
    arcgeometry = new THREE.TorusGeometry(arrow1Radius - 0.5, 0.05, 16, 64, theta); // radius, thickness
    arcmaterial = new THREE.MeshBasicMaterial({ color: "#66bbbb", side: THREE.DoubleSide, opacity: angleArcOpacity, transparent: true });
    arc = new THREE.Mesh(arcgeometry, arcmaterial);
    //shift to new origin
    arc.position.set(0 + sceneShiftX, 0, 0)
    //rotate
    arc.rotation.set(Math.PI / 2, 0, 0)
    scene.add(arc);

    //Create Angle Arcs
    scene.remove(arc2);
    arcgeometry2 = new THREE.TorusGeometry(arrow2Radius - 0.15, 0.05, 16, 64, theta); // radius, thickness
    arcmaterial2 = new THREE.MeshBasicMaterial({ color: "#66bbbb", side: THREE.DoubleSide, opacity: angleArcOpacity, transparent: true });
    arc2 = new THREE.Mesh(arcgeometry2, arcmaterial2);
    //shift to new origin
    arc2.position.set(0 + sceneShiftX, 0, 0)
    //rotate
    arc2.rotation.set(-Math.PI / 2, 0, 0)
    scene.add(arc2);


}




//---------------Boilerplate code----------------
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 12, 0);
// camera.rotation.set(1, Math.PI, 0.5);

scene.add(camera);
const renderer = new THREE.WebGL1Renderer({
    canvas: canvas,
    antialias: true,
});


//LIGHTING
let color = 0xffffff;
let intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
//light shadow
light.position.set(10 + sceneShiftX, 6, 0);
scene.add(light);

intensity = 1.3;
const light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(1 + sceneShiftX, 3, 1);
scene.add(light2);
const light4 = new THREE.AmbientLight(0xffffffff, 1.2); // soft white light
scene.add(light4);
const light7 = new THREE.AmbientLight(0xffffffff); // soft white light
// scene.add(light7);
const light3 = new THREE.DirectionalLight(color, intensity);
light3.position.set(0 + sceneShiftX, 0, -3);
// scene.add(light3);
const light8 = new THREE.DirectionalLight(color, intensity);
light8.position.set(-2 + sceneShiftX, 0, 0);
// scene.add(light8);
renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
// renderer.gammaOutput = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.4;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(canvas);
renderer.setClearColor("#333333"); // whi/te background - replace ffffff with any hex color


//Orbit controlls
const controls = new OrbitControls(camera, canvas);
renderer.render(scene, camera);

let timeVar = 1;
function animate() {
    /*****WARNING********/
    //This animate function starts before the models are even loaded and casuses errors
    requestAnimationFrame(animate);
    // root1.rotation.x += 0.01;
    // root1.rotation.y += 0.01;
    // laserModel.rotation.x += 0.01;
    // console.log(laserModel.rotation.x);
    renderer.render(scene, camera);
    timeVar++;
    if (timeVar == 30) { //ERROR MAY OCCUR HERE TOO
        laserPointer();
    }
    // cube.rotation.x = documentgetElementByI("myRange").value;
    // line.rotation.x = documentgetElementByI("myRange").value;
    // cube.positio n.x = documentgetElementByI("myRange2").value;
    // line.position.x = documentgetElementByI("myRange2").value;
    // cube.position.y = documentgetElementByI("myRangey").value;
    // cube.position.z = documentgetElementByI("myRangez").value;
    // line.position.z = documentgetElementByI("myRangez").value;
};
animate(); // this gets called before the model gets loaded.

document.getElementById("myRange").oninput = function () {
    laserPointer();
}

// window.onload = function () {
// }


document.getElementById("planeToggle").oninput = function () {
    if (document.getElementById("planeToggle").checked) {
        //set opacity/unhidden
        reflectionPlane.material.opacity = planeOpacity;
    }
    else {
        reflectionPlane.material.opacity = 0;
    }
}
document.getElementById("normalToggle").oninput = function () {
    if (document.getElementById("normalToggle").checked) {
        //set opacity/unhidden
        normal.material.opacity = normalOpacity;
        arc.material.opacity = normalOpacity;
        arc2.material.opacity = normalOpacity;
    }
    else {
        normal.material.opacity = 0;
        arc.material.opacity = 0;
        arc2.material.opacity = 0;
    }
}
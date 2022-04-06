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
let arrow1Radius = 2, arrow2Radius = 2.2, beamCentreRadius = 2, laserPointerRadius = 5;

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
loader.load("./assets/3D models glb/Green Cutting Board2.glb", function (glb) {
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
// const material = new THREE.MeshPhongMaterial({ color: 0xffff00, side: THREE.DoubleSide });
// const material = new THREE.MeshPhongMaterial({ color: 0xffff00, side: THREE.DoubleSide });

// reflectionLoader();
let plane = new Reflector(geometry, {
    clipBias: 0,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777
});

// const plane = new THREE.Mesh(geometry, material);
plane.scale.set(3, 8, 1);
plane.rotation.set(Math.PI / 2, Math.PI / 2, 0);
plane.position.set(0 + sceneShiftX, 0, 0);
scene.add(plane);

//Test object
const geometry2 = new THREE.SphereGeometry(.06, 20, 20);
const material2 = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 0 });
let testObject = new THREE.Mesh(geometry2, material2);
testObject.position.set(0 + sceneShiftX, 0, 0);
scene.add(testObject);

//Create a Laser here


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
    //Also put the laser in this part

    //Laser texture
    // let material1 = new THREE.MeshBasicMaterial({
    //     blending: THREE.AdditiveBlending,
    //     color: 0x4444aa,
    //     side: THREE.DoubleSide,
    //     depthWrite: false,
    //     transparent: true
    // });


}

//---------------------------Laser------------------------------
// //Laser 
// function LaserBeam(iconfig) {

//     var config = {
//         length: 100,
//         reflectMax: 1
//     };
//     config = $.extend(config, iconfig);

//     this.object3d = new THREE.Object3D();
//     this.reflectObject = null;
//     this.pointLight = new THREE.PointLight(0xffffff, 1, 4);
//     var raycaster = new THREE.Raycaster();
//     var canvas = generateLaserBodyCanvas();
//     var texture = new THREE.Texture(canvas);
//     texture.needsUpdate = true;

//     //texture
//     var material = new THREE.MeshBasicMaterial({
//         map: texture,
//         blending: THREE.AdditiveBlending,
//         color: 0x4444aa,
//         side: THREE.DoubleSide,
//         depthWrite: false,
//         transparent: true
//     });
//     var geometry = new THREE.PlaneGeometry(1, 0.1 * 5);
//     geometry.rotateY(0.5 * Math.PI);

//     //use planes to simulate laserbeam
//     var i, nPlanes = 15;
//     for (i = 0; i < nPlanes; i++) {
//         var mesh = new THREE.Mesh(geometry, material);
//         mesh.position.z = 1 / 2;
//         mesh.rotation.z = i / nPlanes * Math.PI;
//         this.object3d.add(mesh);
//     }

//     if (config.reflectMax > 0)
//         this.reflectObject = new LaserBeam($.extend(config, {
//             reflectMax: config.reflectMax - 1
//         }));


//     this.intersect = function (direction, objectArray = []) {

//         raycaster.set(
//             this.object3d.position.clone(),
//             direction.clone().normalize()
//         );

//         var intersectArray = [];
//         intersectArray = raycaster.intersectObjects(objectArray, true);

//         //have collision
//         if (intersectArray.length > 0) {
//             this.object3d.scale.z = intersectArray[0].distance;
//             this.object3d.lookAt(intersectArray[0].point.clone());
//             this.pointLight.visible = true;

//             //get normal vector
//             var normalMatrix = new THREE.Matrix3().getNormalMatrix(intersectArray[0].object.matrixWorld);
//             var normalVector = intersectArray[0].face.normal.clone().applyMatrix3(normalMatrix).normalize();

//             //set pointLight under plane
//             this.pointLight.position.x = intersectArray[0].point.x + normalVector.x * 0.5;
//             this.pointLight.position.y = intersectArray[0].point.y + normalVector.y * 0.5;
//             this.pointLight.position.z = intersectArray[0].point.z + normalVector.z * 0.5;

//             //calculation reflect vector
//             var reflectVector = new THREE.Vector3(
//                 intersectArray[0].point.x - this.object3d.position.x,
//                 intersectArray[0].point.y - this.object3d.position.y,
//                 intersectArray[0].point.z - this.object3d.position.z
//             ).normalize().reflect(normalVector);

//             //set reflectObject
//             if (this.reflectObject != null) {
//                 this.reflectObject.object3d.visible = true;
//                 this.reflectObject.object3d.position.set(
//                     intersectArray[0].point.x,
//                     intersectArray[0].point.y,
//                     intersectArray[0].point.z
//                 );

//                 //iteration reflect
//                 this.reflectObject.intersect(reflectVector.clone(), objectArray);
//             }
//         }
//         //non collision
//         else {
//             this.object3d.scale.z = config.length;
//             this.pointLight.visible = false;
//             this.object3d.lookAt(
//                 this.object3d.position.x + direction.x,
//                 this.object3d.position.y + direction.y,
//                 this.object3d.position.z + direction.z
//             );

//             this.hiddenReflectObject();
//         }
//     }

//     this.hiddenReflectObject = function () {
//         if (this.reflectObject != null) {
//             this.reflectObject.object3d.visible = false;
//             this.reflectObject.pointLight.visible = false;
//             this.reflectObject.hiddenReflectObject();
//         }
//     }

//     return;

//     function generateLaserBodyCanvas() {
//         var canvas = document.createElement('canvas');
//         var context = canvas.getContext('2d');
//         canvas.width = 1;
//         canvas.height = 64;
//         // set gradient
//         var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
//         gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
//         gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
//         gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
//         gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
//         gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
//         // fill the rectangle
//         context.fillStyle = gradient;
//         context.fillRect(0, 0, canvas.width, canvas.height);
//         // return the just built canvas 
//         return canvas;
//     }

// }


// // let LaserBeam1 = new LaserBeam({ reflectMax: 5 });
// // scene.add(LaserBeam1);
// // create and add a red laser in the scene
// let laser = new Laser({ color: 0xff0000 });
// console.log(laser);
// scene.add(laser);

// let pt = new THREE.Vector3(0, 0, -1); // the target point to shoot

// // set the source point relative to the camera
// // with offset (0.3, -0.4, -0.2)
// laser.setSource(new THREE.Vector3(0.3, -0.4, -0.2), camera);

// // shoot the target from the source point
// laser.point(pt);

//---------------------------Laser Ends------------------------------

//---------------------------grid floor Ends------------------------------
// const grid = new THREE.InfiniteGridHelper(10, 100);
// grid.material.fragmentShader = grid.material.fragmentShader.replace('vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);', 'vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r * 6.0);');
// // let color = ;

// gui.add(grid.material.uniforms.uSize1, "value", 2, 100).step(1).name("Size 1");
// gui.add(grid.material.uniforms.uSize2, "value", 2, 1000).step(1).name("Size 2");
// gui.add(grid.material.uniforms.uDistance, "value", 100, 10000).step(1).name("Distance");
// gui.addColor({
//     value: 0xffffff
// }, "value").name("Color").onChange(function () { grid.material.uniforms.uColor.value.set(color.value); });;
// scene.add(grid);
//---------------------------grid floor Ends------------------------------



//----------------------------Mirror Cube------------------------
let geometry1 = new THREE.BoxGeometry(0.05, 3.1, 8.1);
let material1 = new THREE.MeshLambertMaterial({ color: "grey" });

let mirrorBack = new THREE.Mesh(geometry1, material1);
mirrorBack.position.set(-0.03 + sceneShiftX, 0, 0)
scene.add(mirrorBack);
//----------------------------Mirror Cube Ends------------------------


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
})


//LIGHTING
let color = 0xffffff;
let intensity = 1.2;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0 + sceneShiftX, 2, 2);
scene.add(light);
intensity = 1.3;
const light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(2 + sceneShiftX, -2, 2);
scene.add(light2);
const light4 = new THREE.AmbientLight(0xffffffff, 2); // soft white light
// scene.add(light4);
const light7 = new THREE.AmbientLight(0xffffffff); // soft white light
// scene.add(light7);
const light3 = new THREE.DirectionalLight(color, intensity);
light3.position.set(0 + sceneShiftX, 0, -3);
scene.add(light3);
const light8 = new THREE.DirectionalLight(color, intensity);
light8.position.set(-2 + sceneShiftX, 0, 0);
scene.add(light8);
renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
// renderer.gammaOutput = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.4;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(canvas);
renderer.setClearColor("#444"); // whi/te background - replace ffffff with any hex color


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



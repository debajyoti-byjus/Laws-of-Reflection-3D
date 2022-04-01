import * as THREE from "./js/three.module.js";
// // console.log(THREE);
import { GLTFLoader } from './js/GLTFLoader.js';
import { OrbitControls } from './js/OrbitControls.js';

// import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';



// import { RGBELoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';
// new RGBELoader().load("./assets/HRDIs/machine_shop_01_4k.hdr", function (texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     // scene.background = null;
//     scene.background = texture;

//     // scene.background = new THREE.Color("0xff0f00");
//     scene.environment = texture;
// });




const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

let root1, root2, root3, magnetModel, arrowModel, scaleval = 0.8;
let roughness0 = 0, transmission1 = 0.9, thick1 = 0;
let tag;
let root1Material;
// loading
const loader = new GLTFLoader();

//-------------Magnet
loader.load("./assets/3D models glb/magnets4.glb", function (glb) {
    magnetModel = glb.scene;
    magnetModel.position.set(0, 0, 0);
    magnetModel.scale.set(1, 1, 1);
    // magnetModel.children[0].material = new THREE.MeshPhongMaterial({ color: 'red' });
    scene.add(magnetModel);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%loaded");
}, function (error) {
    console.log(`An error occured`);
});

//-------------Arrow
// loader.load("./assets/3D models glb/arrow.glb", function (glb) {
//     arrowModel = glb.scene;
//     arrowModel.position.set(0, 1, 0);
//     arrowModel.scale.set(0.2, 0.2, 0.2);
//     // arrowModel.children[0].material = new THREE.MeshPhongMaterial({ color: 'red' });
//     scene.add(arrowModel);
//     console.log(arrowModel);
// }, function (xhr) {
//     console.log((xhr.loaded / xhr.total * 100) + "%loaded");
// }, function (error) {
//     console.log(`An error occured`);
// });

//-------------Curve Testing---------------
//Create a closed wavey loop
let curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1, 0.07, 0),
    new THREE.Vector3(2, 1, 0),
    new THREE.Vector3(1, 2, 0),
    new THREE.Vector3(-1, 2, 0),
    new THREE.Vector3(-2, 1, 0),
    new THREE.Vector3(-1, 0.07, 0),
    new THREE.Vector3(0, 0.07, 0)
]);
curve.curveType = "catmullrom";
curve.tension = 0.6;
curve.closed = true;

console.log(curve);

const points = curve.getPoints(50);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: "grey", linewidth: 1 });
//Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms linewidth will always be 1 regardless of the set value.


// const material = new THREE.LineDashedMaterial({
//     color: 0xff0000,
//     linewidth: 1,
//     scale: 1,
//     dashSize: 3,
//     gapSize: 3,
// });



// Create the final object to add to the scene
let curveObject = new THREE.Line(geometry, material);
scene.add(curveObject);



// let curveObject2 = Object.assign({}, curveObject); //DOESNT WORK!!

//creating Clones....Clone Army Haha
// let curveObjects = new Array();
// for (let i = 1; i <= 8; i++) {
//     curveObjects.push(["0", "1", "2"]);
// }

// for (let i = 1; i <= 8; i++) {
//     //3 lines in each leaf
//     for (let j = 1; j <= 3; j++) {
//         curveObject[i - 1][j - 1] = eval(` curveObject.clone();`);
//         eval(`curveObject[${i - 1}][${j - 1}].rotation.x += Math.PI`);
//         eval(`scene.add(curveObject[${i - 1}][${j - 1}]);`);
//         console.log("hi");
//     }

// }

// let arrowModel2 = arrowModel.children[0].clone();
// arrowModel2.rotation.x += Math.PI;
// scene.add(arrowModel2);


//---arrow test
let arrowModel2;
let arrowModel3 = [];
loader.load("./assets/3D models glb/arrow.glb", function (glb) {
    arrowModel2 = glb.scene;
    let a1 = 1.5;//

    arrowModel2.position.set(0, a1, 0);
    arrowModel2.scale.set(0.1, 0.2, 0.1);
    arrowModel2.rotation.set(0, 0, -1.5708);
    scene.add(arrowModel2);

    arrowModel3.push(arrowModel2) //1st element

    //Clone Army starts here
    for (let i = 1; i <= 7; i++) {
        arrowModel3.push(arrowModel2.clone()); //clone
        arrowModel3[i].position.set(0, a1 * Math.cos(0.7854 * i), a1 * Math.sin(0.7854 * i));
        scene.add(arrowModel3[i]);
    }
    let a2 = 2.14;
    for (let i = 8; i <= 15; i++) {
        arrowModel3.push(arrowModel2.clone()); //clone
        arrowModel3[i].position.set(0, a2 * Math.cos(0.7854 * i), a2 * Math.sin(0.7854 * i));
        scene.add(arrowModel3[i]);
    }
    let a3 = 3.65;
    for (let i = 16; i <= 24; i++) {
        arrowModel3.push(arrowModel2.clone()); //clone
        arrowModel3[i].position.set(0, a3 * Math.cos(0.7854 * i), a3 * Math.sin(0.7854 * i));
        scene.add(arrowModel3[i]);
    }
    // arrowModel3.push(arrowModel2) //1st element
    // arrowModel3.push(arrowModel2.clone());//clone
    // arrowModel3[1].position.set(0, 3, 4);
    // arrowModel3[1].scale.set(0.4, 0.4, 0.4);
    // scene.add(arrowModel3[1]);
});
// arrowModel2.rotation.z += 0.01;

let curveObject2 = curveObject.clone();
curveObject2.rotation.x += Math.PI;
scene.add(curveObject2);

let curveObject3 = curveObject.clone();
curveObject3.rotation.x += Math.PI / 2;
scene.add(curveObject3);

let curveObject4 = curveObject.clone();
curveObject4.rotation.x += Math.PI * 3 / 2;
scene.add(curveObject4);

let curveObject5 = curveObject.clone();
curveObject5.rotation.x += Math.PI * 5 / 4;
scene.add(curveObject5);

let curveObject7 = curveObject.clone();
curveObject7.rotation.x += Math.PI * 7 / 4;
scene.add(curveObject7);

let curveObject9 = curveObject.clone();
curveObject9.rotation.x += Math.PI * 9 / 4;
scene.add(curveObject9);

let curveObject11 = curveObject.clone();
curveObject11.rotation.x += Math.PI * 11 / 4;
scene.add(curveObject11);

// let curveObject13 = curveObject.clone();
// // curveObject13.scale.set(0.7, 0.7, 0.7);
// curveObject13.scale.set(1.2, 1.2, 1.2);
// curveObject13.rotation.x += Math.PI * 13 / 4;
// scene.add(curveObject13);

// let curveObject15 = curveObject.clone();
// curveObject15.scale.set(0.9, 0.7, 0.7);
// // curveObject15.scale.set(1.2, 1.2, 1.2);
// curveObject15.rotation.x += Math.PI * 13 / 4;
// scene.add(curveObject15);

//--------------------------------Outer Loops---------------------------
let curve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.05, 0),
    new THREE.Vector3(1, 0.1, 0),
    new THREE.Vector3(2, 1, 0),
    new THREE.Vector3(1, 2, 0),
    new THREE.Vector3(-1, 2, 0),
    new THREE.Vector3(-2, 1, 0),
    new THREE.Vector3(-1, 0.1, 0),
    new THREE.Vector3(0, 0.05, 0)
]);
curve2.curveType = "catmullrom";
curve2.tension = 0.6;
curveObject2.closed = true;
let points1 = curve2.getPoints(200);
let geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
let material1 = new THREE.LineBasicMaterial({ color: "grey", linewidth: 1 });
// Create the final object to add to the scene
let curveObject011 = new THREE.Line(geometry1, material1);
curveObject011.scale.set(2, 1.7, 0.7);
scene.add(curveObject011);

let curveObject12 = curveObject011.clone();
curveObject12.rotation.x += Math.PI;
scene.add(curveObject12);

let curveObject13 = curveObject011.clone();
curveObject13.rotation.x += Math.PI / 2;
scene.add(curveObject13);

let curveObject14 = curveObject011.clone();
curveObject14.rotation.x += Math.PI * 3 / 2;
scene.add(curveObject14);

let curveObject15 = curveObject011.clone();
curveObject15.rotation.x += Math.PI * 5 / 4;
scene.add(curveObject15);

let curveObject17 = curveObject011.clone();
curveObject17.rotation.x += Math.PI * 7 / 4;
scene.add(curveObject17);

let curveObject19 = curveObject011.clone();
curveObject19.rotation.x += Math.PI * 9 / 4;
scene.add(curveObject19);

let curveObject111 = curveObject011.clone();
curveObject111.rotation.x += Math.PI * 11 / 4;
scene.add(curveObject111);
//----------------------------------------------------------------------




//--------------------------------Inner Loops---------------------------
let curve3 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.1, 0),
    new THREE.Vector3(1, 0.1, 0),
    new THREE.Vector3(2, 1, 0),
    new THREE.Vector3(1, 2, 0),
    new THREE.Vector3(-1, 2, 0),
    new THREE.Vector3(-2, 1, 0),
    new THREE.Vector3(-1, 0.1, 0),
    new THREE.Vector3(0, 0.1, 0)
]);
curve3.curveType = "catmullrom";
curve3.tension = 0.6;
curveObject2.closed = true;
let points2 = curve3.getPoints(50);
let geometry2 = new THREE.BufferGeometry().setFromPoints(points1);
let material2 = new THREE.LineBasicMaterial({ color: "#555555", linewidth: 1 });
// Create the final object to add to the scene
let curveObject211 = new THREE.Line(geometry2, material2);
curveObject211.scale.set(0.7, 0.7, 0.7);
scene.add(curveObject211);

let curveObject22 = curveObject211.clone();
curveObject22.rotation.x += Math.PI;
scene.add(curveObject22);

let curveObject23 = curveObject211.clone();
curveObject23.rotation.x += Math.PI / 2;
scene.add(curveObject23);

let curveObject24 = curveObject211.clone();
curveObject24.rotation.x += Math.PI * 3 / 2;
scene.add(curveObject24);

let curveObject25 = curveObject211.clone();
curveObject25.rotation.x += Math.PI * 5 / 4;
scene.add(curveObject25);

let curveObject27 = curveObject211.clone();
curveObject27.rotation.x += Math.PI * 7 / 4;
scene.add(curveObject27);

let curveObject29 = curveObject211.clone();
curveObject29.rotation.x += Math.PI * 9 / 4;
scene.add(curveObject29);

let curveObject311 = curveObject211.clone();
curveObject311.rotation.x += Math.PI * 11 / 4;
scene.add(curveObject311);
//----------------------------------------------------------------------



//-----------TEXt------
// let sprite = new THREE.TextSprite({
//     text: 'Hello World!',
//     fontFamily: 'Arial, Helvetica, sans-serif',
//     fontSize: 12,
//     color: '#ffbbff',
//   });
//   scene.add(sprite);




//---------------Boilerplate code----------------
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);

camera.position.set(0, 0, 20);
scene.add(camera);
const renderer = new THREE.WebGL1Renderer({
    canvas: canvas,
    antialias: true,

})

// -------------Magnetic Lines of force--------------
/**
 * Set the function which calculates the the B(Magnetic Field)
 */



//LIGHTING
let color = 0xffffff;
let intensity = 1.2;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 2, 2);
scene.add(light);
intensity = 1.3;
const light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(2, -2, 2);
scene.add(light2);

const light4 = new THREE.AmbientLight(0xffffffff); // soft white light
scene.add(light4);
const light7 = new THREE.AmbientLight(0xffffffff); // soft white light
scene.add(light7);
const light3 = new THREE.DirectionalLight(color, intensity);
light3.position.set(0, 0, -3);
scene.add(light3);

const light8 = new THREE.DirectionalLight(color, intensity);
light8.position.set(-2, 0, 0);
scene.add(light8);

// Lights
// function addShadowedLight(x, y, z, color, intensity) {

//     const directionalLight = new THREE.DirectionalLight(color, intensity);
//     directionalLight.position.set(x, y, z);
//     scene.add(directionalLight);

//     directionalLight.castShadow = true;

//     const d = 1;
//     directionalLight.shadow.camera.left = - d;
//     directionalLight.shadow.camera.right = d;
//     directionalLight.shadow.camera.top = d;
//     directionalLight.shadow.camera.bottom = - d;

//     directionalLight.shadow.camera.near = 1;
//     directionalLight.shadow.camera.far = 4;

//     directionalLight.shadow.bias = - 0.002;

// }
// scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
// addShadowedLight(1, 1, 1, 0xffffff, 1.35);
// addShadowedLight(0.5, 1, - 1, 0xffaa00, 1);


renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
// renderer.gammaOutput = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.4;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(canvas);


// renderer.setClearColor(0x000000); // white background - replace ffffff with any hex color

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
    // root1.rotation.z += 0.01;
    // console.log(arrowModel3[1]);
    renderer.render(scene, camera);
    timeVar++;
    // cube.rotation.x = documentgetElementByI("myRange").value;
    // line.rotation.x = documentgetElementByI("myRange").value;
    // cube.positio n.x = documentgetElementByI("myRange2").value;
    // line.position.x = documentgetElementByI("myRange2").value;
    // cube.position.y = documentgetElementByI("myRangey").value;
    // cube.position.z = documentgetElementByI("myRangez").value;
    // line.position.z = documentgetElementByI("myRangez").value;
};
animate(); // this gets called before the model gets loaded.

//insert thte code for adding magnet




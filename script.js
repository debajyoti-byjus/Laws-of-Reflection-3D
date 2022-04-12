import * as THREE from "./js/three.module.js";
// // console.log(THREE);
import { GLTFLoader } from './js/GLTFLoader.js';
import { OrbitControls } from './js/OrbitControls.js';
import { Reflector } from './js/Reflector.js';
import { CSS2DRenderer, CSS2DObject } from './js/CSS2DRenderer.js';

// import { EffectComposer } from './js/EffectComposer.js';
// import { RenderPass } from './js/RenderPass.js';
// import { InfiniteGridHelper } from "./js/InfiniteGridHelper.js";

// -------------------import from CDN -------------------------
// import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';


const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
// this._composer = new EffectComposer(._threejs);

let raylength = 4, m = 1, n = 1, radiusRatio = 0.6;
// let arrow1Radius = 1, arrow2Radius = 1.1, beamCentreRadius = 1, laserPointerRadius = 4;
let arrow1Radius = 2, arrow2Radius = 2.2, beamCentreRadius = 2, laserPointerRadius = 5.25, normalOpacity = 1, planeOpacity = 0.1, angleArcOpacity = 1;
let sceneShiftX = -3;
let root1, root2, root3, laserModel, greenCuttingBoard, arrowModel2, arrowModel, normalDottedModel, scaleval = 0.8;
let roughness0 = 0, transmission1 = 0.9, thick1 = 0;
// let tag, gui;
// const layers = {
//     'Toggle MirrorName': function () {
//         camera.layers.toggle(0);
//     },
//     'Toggle LaserName': function () {
//         camera.layers.toggle(1);
//     },
//     'Enable All': function () {
//         camera.layers.enableAll();
//     },
//     'Disable All': function () {
//         camera.layers.disableAll();
//     }
// }

//TUTORIAL State Variables
let isSliderClicked = 0, tutorialStage = -1, sliderLeftScanned = 0, sliderRightScanned = 0;

//Variable descripotion
/**
 * tutorialStage--
 * = 0 then its label showing stage
 * = 1, then intial popup to drag slider is visible.
 */

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
    laserModel.children[0].castShadow = true;
    laserModel.children[0].receiveShadow = false;
    scene.add(laserModel);

}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%loaded");
}, function (error) {
    console.log(`An error occured`);
});

//-----------Incident Laser Beam-----------------
const geometryIncidentBeam = new THREE.CylinderGeometry(0.04, 0.04, beamCentreRadius * 2, 32);
const materialIncidentBeam = new THREE.MeshPhongMaterial({ color: 0x550000, emissive: 0xff0000, shininess: 0 });
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
    arrowModel.children[0].material = new THREE.MeshPhongMaterial({ color: 0x550000, emissive: 0xff0000, shininess: 0 });
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
    arrowModel2.children[0].material = new THREE.MeshPhongMaterial({ color: 0x550000, emissive: 0xff0000, shininess: 0 });
    scene.add(arrowModel2);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%loaded");
}, function (error) {
    console.log(`An error occured`);
});

//-----------Refracted Laser Beam-----------------
const geometryRefractedBeam = new THREE.CylinderGeometry(0.04, 0.04, beamCentreRadius * 2, 32);
const materialRefractedBeam = new THREE.MeshPhongMaterial({ color: 0x550000, emissive: 0xff0000, shininess: 0 });
const cylinderRefractedBeam = new THREE.Mesh(geometryRefractedBeam, materialRefractedBeam);
cylinderRefractedBeam.position.set(beamCentreRadius + sceneShiftX, 0, 0);
cylinderRefractedBeam.scale.set(1, 1, 1);
cylinderRefractedBeam.rotation.set(0, 0, Math.PI / 2);
scene.add(cylinderRefractedBeam);


//-------------Green Cutting Board----------------
loader.load("./assets/3D models glb/greenBoardFinal.glb", function (glb) {
    greenCuttingBoard = glb.scene;
    greenCuttingBoard.position.set(3 + sceneShiftX, -2, 0);
    greenCuttingBoard.scale.set(6.5, 6.5, 6.5);
    greenCuttingBoard.rotation.set(0, 0, 0);
    // greenCuttingBoard.children[0].material = new THREE.MeshPhongMaterial({ color: 'red' });
    greenCuttingBoard.children[0].receiveShadow = true;
    greenCuttingBoard.children[0].castShadow = false;
    scene.add(greenCuttingBoard);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%loaded");
}, function (error) {
    console.log(`An error occured`);
});

//----------------NORMAL dotted -----------------------
function drawNormal() {
    loader.load("./assets/3D models glb/normal-dotted.glb", function (glb) {
        normalDottedModel = glb.scene;
        normalDottedModel.position.set(0 + sceneShiftX, 0, 0);
        normalDottedModel.scale.set(0.1, 0.08, 0.1);
        normalDottedModel.rotation.set(0, 0, -Math.PI / 2);
        // normalDottedModel.children[0].material = nnew THREE.MeshBasicMaterial({ color: "grey", opacity: normalOpacity, transparent: true })
        scene.add(normalDottedModel);
    }, function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + "%loaded");
    }, function (error) {
        console.log(`An error occured`);
    });
}
function destroyNormal() {
    scene.remove(normalDottedModel);
}
drawNormal();
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
    color: new THREE.Color("#222222"),
    ior: 1.5,
});
const plane = new THREE.Mesh(geometry, material);
plane.scale.set(3, 7, 1);
plane.rotation.set(Math.PI / 2, Math.PI / 2, 0);
plane.position.set(0 + sceneShiftX, 0.1, 0);
scene.add(plane);

//----------------------------Mirror Cube------------------------
let geometry1 = new THREE.BoxGeometry(0.05, 3.3, 7.1);
let material1 = new THREE.MeshLambertMaterial({ color: "#ffffff" });

let mirrorBack = new THREE.Mesh(geometry1, material1);
mirrorBack.position.set(-0.03 + sceneShiftX, 0.04, 0)
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
// const geometrynormal = new THREE.CylinderGeometry(0.02, 0.02, beamCentreRadius * 1.67, 32);
// const materialnormal = new THREE.MeshBasicMaterial({ color: "grey", opacity: normalOpacity, transparent: true });
// let normal = new THREE.Mesh(geometrynormal, materialnormal);
// normal.scale.set(0.9, 0.9, 0.9);
// normal.rotation.set(0, 0, Math.PI / 2);
// normal.position.set(1.5 + sceneShiftX, 0, 0);
// scene.add(normal);


//Test object -  it lies in the centre of the mirrow where the two rays meet(for making a seamless contact)
const geometry2 = new THREE.SphereGeometry(.04, 20, 20);
const material2 = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 0 });
let testObject = new THREE.Mesh(geometry2, material2);
testObject.position.set(0 + sceneShiftX, 0, 0);
scene.add(testObject);

//Create an initial arc here
let arcgeometry = new THREE.TorusGeometry(10, 3, 16, 100);
let arcmaterial = new THREE.MeshPhongMaterial({ color: "grey", opacity: 0, transparent: true });
let arc = new THREE.Mesh(arcgeometry, arcmaterial);
scene.add(arc);

//Create an initial 2nd arc here
let arcgeometry2 = new THREE.TorusGeometry(10, 3, 16, 100);
let arcmaterial2 = new THREE.MeshPhongMaterial({ color: "grey", opacity: 0, transparent: true });
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

    if (document.getElementById("normalToggle").checked) {
        //Destroy old arcs
        destroyArcs();
        //create arcs here
        createArcs();
    }
    let angleOfIncidence = theta * 180.0 / Math.PI;
    document.getElementById("anglelabelid").innerHTML = "i = " + Math.round(angleOfIncidence).toString() + " &deg;";
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


//----------------------css2d---------------------
camera.layers.enableAll();
// camera.layers.toggle(1);

// const axesHelper = new THREE.AxesHelper(7);
// axesHelper.layers.enableAll();
// scene.add(axesHelper);

const mirrorDiv = document.createElement('div');
mirrorDiv.className = 'label';
mirrorDiv.textContent = 'Mirror';
mirrorDiv.style.marginTop = '-1em';
mirrorDiv.style.backgroundColor = '#aaaaaaaa'; //faint border
mirrorDiv.style.backdropFilter = "blur(5px)";
mirrorDiv.style.borderRadius = "0.3em";
mirrorDiv.style.fontSize = "1.5em";
mirrorDiv.style.padding = '.3em .5em';
const mirrorLabel = new CSS2DObject(mirrorDiv);
// --------------------CONTROL THE LABEL HERE!! -----------------
mirrorDiv.style.opacity = '0';
mirrorLabel.position.set(0.25, -0.25, 0);
plane.add(mirrorLabel);
mirrorLabel.layers.set(0); //change this to show or hide the labels



const incidentRayDiv = document.createElement('div');
incidentRayDiv.className = 'label';
incidentRayDiv.textContent = 'Incident Ray';
incidentRayDiv.style.marginTop = '-1em';
incidentRayDiv.style.backgroundColor = '#aaaaaaaa'; //faint border
incidentRayDiv.style.backdropFilter = "blur(5px)";
incidentRayDiv.style.borderRadius = "0.3em";
incidentRayDiv.style.fontSize = "1.5em";
incidentRayDiv.style.padding = '.3em .5em';
const incidentRayLabel = new CSS2DObject(incidentRayDiv);
// --------------------CONTROL THE LABEL HERE!! -----------------
//********************************************************************* */
incidentRayDiv.style.opacity = '0';
//*******************  //change this to show or hide the labels!!!!!!!!!!!!
incidentRayLabel.position.set(0, 0.15, 1.5);
plane.add(incidentRayLabel);
incidentRayLabel.layers.set(0); //change this to show or hide the labels





const reflectedRayDiv = document.createElement('div');
reflectedRayDiv.className = 'label';
reflectedRayDiv.textContent = 'Reflected Ray';
reflectedRayDiv.style.marginTop = '-1em';
reflectedRayDiv.style.backgroundColor = '#aaaaaaaa'; //faint border
reflectedRayDiv.style.backdropFilter = "blur(5px)";
reflectedRayDiv.style.borderRadius = "0.3em";
reflectedRayDiv.style.padding = '.3em .5em';
reflectedRayDiv.style.fontSize = "1.5em";
const reflectedRayLabel = new CSS2DObject(reflectedRayDiv);
// --------------------CONTROL THE LABEL HERE!! -----------------
//********************************************************************* */
reflectedRayDiv.style.opacity = '0';
//*******************  //change this to show or hide the labels!!!!!!!!!!!!
reflectedRayLabel.position.set(0, -0.15, 1.5);
plane.add(reflectedRayLabel);
reflectedRayLabel.layers.set(0); //change this to show or hide the labels





const normalDiv = document.createElement('div');
normalDiv.className = 'label';
normalDiv.textContent = 'normal';
normalDiv.style.marginTop = '-1em';
normalDiv.style.backgroundColor = '#aaaaaaaa'; //faint border
normalDiv.style.backdropFilter = "blur(5px)";
normalDiv.style.borderRadius = "0.3em";
normalDiv.style.padding = '.3em .5em';
normalDiv.style.fontSize = "1.5em";
const normalLabel = new CSS2DObject(normalDiv);
// --------------------CONTROL THE LABEL HERE!! -----------------
//********************************************************************* */
normalDiv.style.opacity = '0';
//*******************  //change this to show or hide the labels!!!!!!!!!!!!
normalLabel.position.set(-0.1, 0, 3);
plane.add(normalLabel);
normalLabel.layers.set(0); //change this to show or hide the labels






const laserPointerDiv = document.createElement('div');
laserPointerDiv.className = 'label';
laserPointerDiv.textContent = 'Laser Pointer';
laserPointerDiv.style.marginTop = '-1em';
laserPointerDiv.style.backgroundColor = '#aaaaaaaa'; //faint border
laserPointerDiv.style.backdropFilter = "blur(5px)";
laserPointerDiv.style.borderRadius = "0.3em";
laserPointerDiv.style.padding = '.3em .5em';
laserPointerDiv.style.fontSize = "1.5em";
const laserPointerLabel = new CSS2DObject(laserPointerDiv);
// --------------------CONTROL THE LABEL HERE!! -----------------
//********************************************************************* */
laserPointerDiv.style.opacity = '0';
//*******************  //change this to show or hide the labels!!!!!!!!!!!!
laserPointerLabel.position.set(-0.1, 0.5, 5);
plane.add(laserPointerLabel);
laserPointerLabel.layers.set(0); //change this to show or hide the labels







let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);
//-------------------css2d ends-----------------------


//LIGHTING
//DIR LIGHTING
let dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
dirLight1.position.set(10 + sceneShiftX, 6, 0);
dirLight1.castShadow = true;
dirLight1.layers.enableAll(); //so t
scene.add(dirLight1);

//Ambient LIGHTING
let ambient1 = new THREE.AmbientLight(0xffffffff, 1.2); // soft white light
ambient1.layers.enableAll();
scene.add(ambient1);


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

// const helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add( helper );

//Orbit controlls
const controls = new OrbitControls(camera, labelRenderer.domElement);
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
    labelRenderer.render(scene, camera);
    timeVar++;
    if (timeVar == 30) { //ERROR MAY OCCUR HERE TOO
        laserPointer();
    }

    // console.log(camera.position);
    // console.log(camera.getWorldPosition());
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
    if (tutorialStage == 1) {
        isSliderClicked = 1;
        document.getElementById("tutorial1").style.display = "none";
    }
    if (isSliderClicked == 1 && document.getElementById("myRange").value <= 0.4) {
        sliderLeftScanned = 1;
    }
    if (isSliderClicked == 1 && document.getElementById("myRange").value >= 1.0) {
        sliderRightScanned = 1;
    }
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
        // arc.material.opacity = angleArcOpacity;
        // arc2.material.opacity = angleArcOpacity;
        // normal.material.opacity = normalOpacity;
        drawNormal();
        //create arcs here
        createArcs();

    }
    else {
        // normal.material.opacity = 0;
        //destroy arcs here
        destroyArcs();
        destroyNormal();
        // arc.material.opacity = 0;
        // arc2.material.opacity = 0;
    }
}
function createArcs() {
    let theta = document.getElementById("myRange").value;
    //Create Angle Arcs
    arcgeometry = new THREE.TorusGeometry(arrow1Radius - 0.9, 0.03, 16, 64, theta); // radius, thickness
    arcmaterial = new THREE.MeshBasicMaterial({ color: "white", opacity: angleArcOpacity, transparent: true });
    arc = new THREE.Mesh(arcgeometry, arcmaterial);
    //shift to new origin
    arc.position.set(0 + sceneShiftX, 0, 0)
    //rotate
    arc.rotation.set(Math.PI / 2, 0, 0)
    scene.add(arc);

    //Create Angle Arcs
    arcgeometry2 = new THREE.TorusGeometry(arrow2Radius - 0.9, 0.03, 16, 64, theta); // radius, thickness
    arcmaterial2 = new THREE.MeshBasicMaterial({ color: "white", opacity: angleArcOpacity, transparent: true });
    arc2 = new THREE.Mesh(arcgeometry2, arcmaterial2);
    //shift to new origin
    arc2.position.set(0 + sceneShiftX, 0, 0)
    //rotate
    arc2.rotation.set(-Math.PI / 2, 0, 0)
    scene.add(arc2);
}

function destroyArcs() {
    scene.remove(arc);
    scene.remove(arc2);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
guidedAnimation();
async function guidedAnimation() {     // Async function
    //hiding Checkboxes
    document.getElementById("labelplaneid").style.display = "none";
    document.getElementById("labelnormalid").style.display = "none";
    document.getElementById("planeToggle").style.display = "none";
    document.getElementById("normalToggle").style.display = "none";

    tutorialStage = 0;
    // show mirror label
    await sleep(500);
    mirrorDiv.style.opacity = '1';

    // Laser pointer label
    await sleep(500);
    mirrorDiv.style.opacity = '0';
    laserPointerDiv.style.opacity = '1';
    // camera.position.set(4.3, 10.3, 4.7);


    // incident ray
    await sleep(500);
    laserPointerDiv.style.opacity = '0';
    incidentRayDiv.style.opacity = '1';

    // reflected ray    
    await sleep(500);
    incidentRayDiv.style.opacity = '0';
    reflectedRayDiv.style.opacity = '1';

    // normal ray    
    await sleep(500);
    reflectedRayDiv.style.opacity = '0';
    normalDiv.style.opacity = '1';
    await sleep(500);
    normalDiv.style.opacity = '0';

    //all labels shown
    //popup
    tutorialStage = 1;
    document.getElementById("tutorial1").style.display = "block";
    //hide if user clicks on slider(done in range function)

    while (2 - sliderLeftScanned - sliderRightScanned) {
        await sleep(100);
    }
    //show next button
    document.getElementById("NextBtn").style.display = "block";

}


// document.getElementById("NextBtn").onclick = function () {
//     //first question stage
//     if ()
// }

//async funtion to fade in and fade away the

// See what happens to the reflected ray when we move the angle of the pointer.
// Here the angle of the incidence, i, is equal to the angle of relection, r.

//change the camera view to show that the normal, incident ray and the relfected rays all lie on the same plane




//1. make markers for
/**
 * 1. laser pointer
 * 2. Mirror
 * 3. normal
 * 4. incident ray (if angle greater than certain angle show it, else hide)
 * 5. reflected ray
 * 6. 
 */
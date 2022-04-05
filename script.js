import * as THREE from "./js/three.module.js";
// // console.log(THREE);
import { GLTFLoader } from './js/GLTFLoader.js';
import { OrbitControls } from './js/OrbitControls.js';
import { Reflector } from './js/Reflector.js';

// import { EffectComposer } from './js/EffectComposer.js';
// import { RenderPass } from './js/RenderPass.js';

// import { InfiniteGridHelper } from "./js/InfiniteGridHelper.js";
// import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';


const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
// this._composer = new EffectComposer()

let root1, root2, root3, laserModel, greenCuttingBoard, arrowModel, scaleval = 0.8;
let roughness0 = 0, transmission1 = 0.9, thick1 = 0;
let tag;
let root1Material;
// loading
const loader = new GLTFLoader();

//-------------LASER Box ----------------
loader.load("./assets/3D models glb/scene.glb", function (glb) {
    laserModel = glb.scene;
    laserModel.position.set(4, 0, 0);
    laserModel.scale.set(0.005, 0.005, 0.005);
    laserModel.rotation.set(0, 0, 0);
    // laserModel.children[0].material = new THREE.MeshPhongMaterial({ color: 'red' });
    scene.add(laserModel);
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "%loaded");
}, function (error) {
    console.log(`An error occured`);
});

//-----------Incident Laser Beam-----------------
const geometryIncidentBeam = new THREE.CylinderGeometry(0.06, 0.06, 2, 32);
const materialIncidentBeam = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 0 });
const cylinderIncidentBeam = new THREE.Mesh(geometryIncidentBeam, materialIncidentBeam);
cylinderIncidentBeam.position.set(1, 0, 0);
cylinderIncidentBeam.scale.set(1, 1, 1);
cylinderIncidentBeam.rotation.set(0, 0, Math.PI / 2);
scene.add(cylinderIncidentBeam);

//-----------Refracted Laser Beam-----------------
const geometryRefractedBeam = new THREE.CylinderGeometry(0.06, 0.06, 2, 32);
const materialRefractedBeam = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 0 });
const cylinderRefractedBeam = new THREE.Mesh(geometryRefractedBeam, materialRefractedBeam);
cylinderRefractedBeam.position.set(1, 0, 0);
cylinderRefractedBeam.scale.set(1, 1, 1);
cylinderRefractedBeam.rotation.set(0, 0, Math.PI / 2);
scene.add(cylinderRefractedBeam);


//-------------Green Cutting Board----------------
loader.load("./assets/3D models glb/Green Cutting Board2.glb", function (glb) {
    greenCuttingBoard = glb.scene;
    greenCuttingBoard.position.set(1, -2, 0);
    greenCuttingBoard.scale.set(5, 5, 5);
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
plane.position.set(0, 0, 0);
scene.add(plane);

//Test object
const geometry2 = new THREE.SphereGeometry(.06, 20, 20);
const material2 = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 0 });
let testObject = new THREE.Mesh(geometry2, material2);
scene.add(testObject);

//Create a Laser here


//-------LASER position wrt slider --------------
function laserPointer() {
    //takes the slider value and rotates/repositions the pointer
    let sliderval = document.getElementById("myRange").value;
    let x, z, theta, radius = 4;
    theta = sliderval;
    x = radius * Math.cos(theta);
    z = radius * Math.sin(theta);

    laserModel.position.set(x, 0, z);
    laserModel.rotation.set(0, -theta, 0);
    let m = 3, n = 1;
    let xLaserStart = n * x / (m + n);
    let zLaserStart = n * z / (m + n);
    cylinderIncidentBeam.position.set(xLaserStart, 0, zLaserStart);
    cylinderIncidentBeam.rotation.set(0, -theta, Math.PI / 2);
    cylinderRefractedBeam.position.set(xLaserStart, 0, -zLaserStart);
    cylinderRefractedBeam.rotation.set(0, theta, Math.PI / 2);
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
mirrorBack.position.set(-0.03, 0, 0)
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
light.position.set(0, 2, 2);
scene.add(light);
intensity = 1.3;
const light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(2, -2, 2);
scene.add(light2);
// const light4 = new THREE.AmbientLight(0xffffffff); // soft white light
// scene.add(light4);
// const light7 = new THREE.AmbientLight(0xffffffff); // soft white light
// scene.add(light7);
const light3 = new THREE.DirectionalLight(color, intensity);
light3.position.set(0, 0, -3);
scene.add(light3);
const light8 = new THREE.DirectionalLight(color, intensity);
light8.position.set(-2, 0, 0);
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
//     import { Reflector } from './js/Reflector.js';
// }

// function reflectionLoader() {
//     class Reflector extends THREE.Mesh {
//         constructor(geometry, options = {}) {

//             super(geometry);
//             this.type = 'Reflector';
//             const scope = this;
//             const color = options.color !== undefined ? new THREE.Color(options.color) : new THREE.Color(0x7F7F7F);
//             const textureWidth = options.textureWidth || 512;
//             const textureHeight = options.textureHeight || 512;
//             const clipBias = options.clipBias || 0;
//             const shader = options.shader || Reflector.ReflectorShader;
//             const multisample = options.multisample !== undefined ? options.multisample : 4; //

//             const reflectorPlane = new THREE.Plane();
//             const normal = new THREE.Vector3();
//             const reflectorWorldPosition = new THREE.Vector3();
//             const cameraWorldPosition = new THREE.Vector3();
//             const rotationMatrix = new THREE.Matrix4();
//             const lookAtPosition = new THREE.Vector3(0, 0, - 1);
//             const clipPlane = new THREE.Vector4();
//             const view = new THREE.Vector3();
//             const target = new THREE.Vector3();
//             const q = new THREE.Vector4();
//             const textureMatrix = new THREE.Matrix4();
//             const virtualCamera = new THREE.PerspectiveCamera();
//             const renderTarget = new THREE.WebGLRenderTarget(textureWidth, textureHeight, {
//                 samples: multisample
//             });
//             const material = new THREE.ShaderMaterial({
//                 uniforms: THREE.UniformsUtils.clone(shader.uniforms),
//                 fragmentShader: shader.fragmentShader,
//                 vertexShader: shader.vertexShader
//             });
//             material.uniforms['tDiffuse'].value = renderTarget.texture;
//             material.uniforms['color'].value = color;
//             material.uniforms['textureMatrix'].value = textureMatrix;
//             this.material = material;

//             this.onBeforeRender = function (renderer, scene, camera) {

//                 reflectorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
//                 cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
//                 rotationMatrix.extractRotation(scope.matrixWorld);
//                 normal.set(0, 0, 1);
//                 normal.applyMatrix4(rotationMatrix);
//                 view.subVectors(reflectorWorldPosition, cameraWorldPosition); // Avoid rendering when reflector is facing away

//                 if (view.dot(normal) > 0) return;
//                 view.reflect(normal).negate();
//                 view.add(reflectorWorldPosition);
//                 rotationMatrix.extractRotation(camera.matrixWorld);
//                 lookAtPosition.set(0, 0, - 1);
//                 lookAtPosition.applyMatrix4(rotationMatrix);
//                 lookAtPosition.add(cameraWorldPosition);
//                 target.subVectors(reflectorWorldPosition, lookAtPosition);
//                 target.reflect(normal).negate();
//                 target.add(reflectorWorldPosition);
//                 virtualCamera.position.copy(view);
//                 virtualCamera.up.set(0, 1, 0);
//                 virtualCamera.up.applyMatrix4(rotationMatrix);
//                 virtualCamera.up.reflect(normal);
//                 virtualCamera.lookAt(target);
//                 virtualCamera.far = camera.far; // Used in WebGLBackground

//                 virtualCamera.updateMatrixWorld();
//                 virtualCamera.projectionMatrix.copy(camera.projectionMatrix); // Update the texture matrix

//                 textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
//                 textureMatrix.multiply(virtualCamera.projectionMatrix);
//                 textureMatrix.multiply(virtualCamera.matrixWorldInverse);
//                 textureMatrix.multiply(scope.matrixWorld); // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
//                 // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf

//                 reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
//                 reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);
//                 clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant);
//                 const projectionMatrix = virtualCamera.projectionMatrix;
//                 q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
//                 q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
//                 q.z = - 1.0;
//                 q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14]; // Calculate the scaled plane vector

//                 clipPlane.multiplyScalar(2.0 / clipPlane.dot(q)); // Replacing the third row of the projection matrix

//                 projectionMatrix.elements[2] = clipPlane.x;
//                 projectionMatrix.elements[6] = clipPlane.y;
//                 projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
//                 projectionMatrix.elements[14] = clipPlane.w; // Render

//                 renderTarget.texture.encoding = renderer.outputEncoding;
//                 scope.visible = false;
//                 const currentRenderTarget = renderer.getRenderTarget();
//                 const currentXrEnabled = renderer.xr.enabled;
//                 const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
//                 renderer.xr.enabled = false; // Avoid camera modification

//                 renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

//                 renderer.setRenderTarget(renderTarget);
//                 renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

//                 if (renderer.autoClear === false) renderer.clear();
//                 renderer.render(scene, virtualCamera);
//                 renderer.xr.enabled = currentXrEnabled;
//                 renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
//                 renderer.setRenderTarget(currentRenderTarget); // Restore viewport

//                 const viewport = camera.viewport;

//                 if (viewport !== undefined) {

//                     renderer.state.viewport(viewport);

//                 }

//                 scope.visible = true;

//             };

//             this.getRenderTarget = function () {

//                 return renderTarget;

//             };

//             this.dispose = function () {

//                 renderTarget.dispose();
//                 scope.material.dispose();

//             };

//         }
//     }
//     Reflector.prototype.isReflector = true;
//     Reflector.ReflectorShader = {
//         uniforms: {
//             'color': {
//                 value: null
//             },
//             'tDiffuse': {
//                 value: null
//             },
//             'textureMatrix': {
//                 value: null
//             }
//         },
//         vertexShader:
//             /* glsl */
//             `
// 		uniform mat4 textureMatrix;
// 		varying vec4 vUv;

// 		#include <common>
// 		#include <logdepthbuf_pars_vertex>

// 		void main() {

// 			vUv = textureMatrix * vec4( position, 1.0 );

// 			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

// 			#include <logdepthbuf_vertex>

// 		}`,
//         fragmentShader:
//             /* glsl */
//             `
// 		uniform vec3 color;
// 		uniform sampler2D tDiffuse;
// 		varying vec4 vUv;

// 		#include <logdepthbuf_pars_fragment>

// 		float blendOverlay( float base, float blend ) {

// 			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

// 		}

// 		vec3 blendOverlay( vec3 base, vec3 blend ) {

// 			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

// 		}

// 		void main() {

// 			#include <logdepthbuf_fragment>

// 			vec4 base = texture2DProj( tDiffuse, vUv );
// 			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

// 		}`
//     };
//     THREE.Reflector = Reflector;
// }



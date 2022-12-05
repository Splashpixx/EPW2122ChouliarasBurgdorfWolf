//import { toRadEx } from "./lib/testKram";

var clock = new THREE.Clock();

function init() {
  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(54.82, 52.9, -57.82);
  camera.rotation.set(toRad(-138.79), toRad(34.03), toRad(153.89));

  var renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("rgb(55,55,55)", 1);

  document.getElementById("3dMap").appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  //Lights
  const lightTargetObject = new THREE.Object3D();
  scene.add(lightTargetObject);
  lightTargetObject.position.set(-1, -1, 0);
  var light = new THREE.DirectionalLight("rgb(255,255,255)", 0.3);
  light.target = lightTargetObject;
  light.shadow = true;
  scene.add(light);

  var ambientLight = new THREE.AmbientLight("rgb(255,255,255)", 0.5);
  scene.add(ambientLight);

  //Geometry
  var objloader = new THREE.OBJLoader();
  objloader.load("obj/testGeo.obj", function (object) {
    const testMat = new THREE.MeshPhongMaterial({
      color: 0xff0000,
    });
    object.material = testMat;
    scene.add(object);
  });

  //Line Geo
  const lineMat = new THREE.LineDashedMaterial({
    color: 0xff0000,
    linewidth: 1,
    scale: 1,
    dashSize: 3,
    gapSize: 1,
  });

  const linePoints = [];
  linePoints.push(new THREE.Vector3(-50, 11, 0));
  linePoints.push(new THREE.Vector3(0, 11, 0));
  linePoints.push(new THREE.Vector3(10, 1, 0));
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);

  const line = new THREE.Line(lineGeo, lineMat);
  scene.add(line);

  update(renderer, scene, camera, controls);
}

function generateBox(w, h, d) {
  var geo = new THREE.BoxGeometry(w, h, d);
  var mat = new THREE.MeshPhongMaterial({
    color: "rgb(255,255,255)",
  });
  var mesh = new THREE.Mesh(geo, mat);
  return mesh;
}

function generatePointLight(color, intensity) {
  return new THREE.PointLight(color, intensity);
}

function update(renderer, scene, camera, controls) {
  scene.children[1].rotation.x += toRad(10 * clock.getDelta());

  controls.update();

  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  requestAnimationFrame(function () {
    update(renderer, scene, camera, controls);
  });
}

init();

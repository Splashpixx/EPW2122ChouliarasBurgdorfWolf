//import { toRadEx } from "./lib/testKram";

var clock = new THREE.Clock();

function init() {
  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(5.482, 5.29, -5.782);
  camera.rotation.set(toRad(-138.79), toRad(34.03), toRad(153.89));

  var renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("rgb(55,55,55)", 1);

  document.getElementById("3dMap").appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  //Lights
  var light = new generatePointLight("rgb(255,255,255)", 1);
  light.position.set(0, 5, 0);
  scene.add(light);

  //Geometry
  var box = generateBox(1, 1, 1);
  scene.add(box);

  var objloader = new THREE.OBJLoader();
  objloader.load("obj/testGeo.obj", function (object) {
    object.position.set(-3, 0, 0);
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
  linePoints.push(new THREE.Vector3(-3, 0, 0));
  linePoints.push(new THREE.Vector3(0, 3, 0));
  linePoints.push(new THREE.Vector3(3, 0, 0));
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

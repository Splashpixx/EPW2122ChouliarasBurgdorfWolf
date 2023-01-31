/*
- Nützliche Links -

// https://www.youtube.com/watch?v=kxXaIHi1j4w
// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models
//https://onion2k.github.io/r3f-by-example/examples/hooks/rotating-cube/
//https://codesandbox.io/s/splines-3k4g6?file=/src/Nodes.js:148-265
//https://codesandbox.io/s/basic-clerping-example-qh8vhf?file=/src/Scene.js
// https://www.youtube.com/watch?v=LNvn66zJyKs https://onion2k.github.io/r3f-by-example/

// https://codesandbox.io/s/example-f8t3w?file=/src/App.js:4177-4370 // GUI Example

*/

import './App.css';
import { Canvas, extend, useThree } from '@react-three/fiber';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";
import React, { useState, useRef, useLayoutEffect, useReducer, Suspense, useEffect  } from "react";

import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'

// Eigene Scripts //

import {findPath} from "./test/FindPath";
import {importPathMesh} from "./test/ImportPathMesh";
import {RenderChild, Thing, AddNewPointRandom, BadCode} from "./buildingGen"
// import {MeshClickable, MeshNOTClickable, ImportMeshesFromOBJ} from "./test/MeshFunctions";
import { hover } from '@testing-library/user-event/dist/hover';

import {EffectComposer, DepthOfField, Bloom, Noise, Vignette, Outline} from '@react-three/postprocessing'

/*
!- Hooks -!
- Hooks starten immer mit use (useState, useEffekt, useReducer...)
- Hooks sind immer am start einer funktion

useState: wenn sich etwas ändert -> Re-render UI | Aufbau const [value/var, setter] = useState() 
useEffekt: wird immer aufberufen im fall dass sich eins state ändert
useRef: ähnlich wie useState, nur dass es die UI nicht neu rendert
useReducer: Komplexe version von useState das eine funktion aufrufen kann


Bieten die Möglichkeit, State in Functional Components zu nutzen, was bisher nur in Class Components möglich war.
*/ 

const Scene = () => {

  // Setting const
  const [wegpunkt1, setWegpunkt1] = useState(null);
  const [wegpunkt2, setWegpunkt2] = useState(null);

  const [treppeRadio, setTreppeRadio] = useState(true);
  const [aufzugRadio, setAufzugRadio] = useState(null);
  const [popupTrigger, setPopupTrigger] = useState(null);
  

 //kamera = true ist die normale kamera, false orthographisch
  const [kamera, set] = useState(true)
  const rotierbarkeit = (kamera ? true : false)

  const [wegPunkte, setWegPunkte] = useState(null)

  const activeRooms = []

    // Fügt dem Array über uns den angeklickten vector hinzu
    function raumauswahl(state, action) {
    
      const vecToArray = action.payloade
      // Increment = Raum ist Aktiv, Decrement = Raum ist inaktiv 
      switch (action.type) {
        case 'increment':
          
          // wenn unser arrayWithActiveRooms leer ist müssen wir nicht schauen ob es den ausgewählten draum im array doppelt gibt 
          if(activeRooms.length <= 0){
            activeRooms.push(vecToArray)
            } else {
              var inArray = false
              // Geht den array Durch und schaut nach doppelten einträgen
              activeRooms.forEach(element => {
                if(JSON.stringify(element) == JSON.stringify(vecToArray)){
                  inArray = true
                }
                });
                if(!inArray){
                  activeRooms.push(vecToArray)
                }
            }
  
          return
        case 'decrement':
          if(JSON.stringify(activeRooms[0]) == JSON.stringify(vecToArray)){
            activeRooms.splice(0, 1);
          }
          
          if (JSON.stringify(activeRooms[1]) == JSON.stringify(vecToArray)){
            activeRooms.splice(1, 1);
          } 
            return
        default:
          throw new Error();
      }
    }
  
  // Gebäude !-Pathfinding ist in der buildingGen.js-!

  function AddEtage03Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_03_Raeume.obj",true, "#ff0000", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage03Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_03_Geo.obj",false, "#aaaaaa", "", "", raumauswahl, activeRooms)}
  function AddEtage02Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_02_Raeume.obj",true, "#cc0000", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage02Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_02_Geo.obj",false, "#999999", "", "", raumauswahl, activeRooms)}
  function AddEtage01Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_01_Raeume.obj",true, "#880000", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage01Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_01_Geo.obj",false, "#888888", "", "", raumauswahl, activeRooms)}
  function AddEtage00Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_00_Raeume.obj",true, "#440000", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage00Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_00_Geo.obj",false, "#666666", "", "", raumauswahl, activeRooms)}
  function AddStairs(){
    return ImportMeshesFromOBJ("obj/Stairs.obj",false, "#66aa66", "", "", raumauswahl, activeRooms)}
  function AddElevators(){
    return ImportMeshesFromOBJ("obj/Elevators.obj",false, "#5566bb", "", "", raumauswahl, activeRooms)}
  function AddGround(){
    return ImportMeshesFromOBJ("obj/Ground.obj",false, "#222222", "", "", raumauswahl, activeRooms)}


    function ImportMeshesFromOBJ(path, clickable, baseColor, hoverColor, activeColor, raumauswahl, activeRooms){
      const obj = useLoader(OBJLoader, path, (loader) => {})
  
      const listofMeshes = []
  
      obj.children.map(e => {
          listofMeshes.push(RenderChild2(e, clickable, baseColor, hoverColor, activeColor, raumauswahl, activeRooms))
      })
  
      return listofMeshes.map(e => {
          return e
      })
  }
  
  function RenderChild2(e, clickable, baseColor, hoverColor, activeColor, raumauswahl, activeRooms){
      const [active, setActive] = useState(false)
      const [hovered, setHover] = useState(false)
  
      const [state, dispatcher] = useReducer(raumauswahl)
  
      const raumname = "" + e.name
      raumname.slice(-3)
  
      if (clickable){
          return MeshClickable(e.scale, e.material, e.geometry, e.id, raumname, baseColor, hoverColor, activeColor, raumauswahl, activeRooms)
      }else{
          return MeshNOTClickable(e.scale, e.material, e.geometry, e.id, raumname, baseColor, raumauswahl, activeRooms)
      }
  }
  
  function MeshClickable(scale, material, geometry, id, name, baseColor, hoverColor, activeColor, raumauswahl, activeRooms){
  
      const [active, setActive] = useState(false)
      const [hovered, setHover] = useState(false)
      const [state, dispatcher] = useReducer(raumauswahl)
  
      return(
          <mesh
              scale = {scale}
              material = {material}
              geometry = {geometry}
              key = {id}
              name = {name}
  
              onPointerOver={(event) => {setHover(true); event.stopPropagation()}}
  
              onPointerOut={(event) => {setHover(false); event.stopPropagation()}}
  
              onClick={(e) => {
                  if(activeRooms.length <= 1){
                      setActive(!active)
                      active ? dispatcher({type: 'decrement', payloade: name}) : dispatcher({type: 'increment', payloade: name})
                  } else {
                      setActive(false)
                      dispatcher({type: 'decrement', payloade: name})
                  }
                  e.stopPropagation()
              }
              }
          >
              <meshStandardMaterial color={active ? activeColor : baseColor  && hovered ? hoverColor : baseColor} />
          </mesh>
      )
  }
  
  function MeshNOTClickable(scale, material, geometry, id, name, baseColor, raumauswahl){
  
      const [active, setActive] = useState(false)
      const [hovered, setHover] = useState(false)
      const [state, dispatcher] = useReducer(raumauswahl)
  
      return(
          <mesh
              scale = {scale}
              material = {material}
              geometry = {geometry}
              key = {id}
              name = {name}
  
              onClick={(e) => {}}
          >
              <meshStandardMaterial color={baseColor} />
          </mesh>
      )
  }
 
  /* Kamera einstellung und erstellung */
  
  function changeView(){
    set(!kamera)
  }

  function SwitchCam() {
    return (
      <div className="SwitchCam">
        <button onClick={changeView}>Switch cam</button>
      </div>
    )
  }

  /* ALLES MIT LINIEN IST HIER*/
  /* Linien gen https://codesandbox.io/s/r3f-line-adding-points-workaround-11g9h?file=/src/index.js */

  async function wegBerechnung(start, ende, treppe, aufzug){
    const pathMesh = await importPathMesh("obj/PathMesh.obj")
    const pathtest = await findPath(pathMesh[start],pathMesh[ende],pathMesh,treppe,aufzug)
    return pathtest
  }

  function routeBerechnen() {

    setWegPunkte(wegPunkte => [])

    const auswahl1 = Number(activeRooms[0].slice(-3))
    const auswahl2 = Number(activeRooms[1].slice(-3))

    console.log(auswahl1, auswahl2, activeRooms)
    
    if (auswahl1 > 0 || auswahl2 > 0) {
      const weg = wegBerechnung(auswahl1, auswahl2)
      weg.then((data) => {
        if(data != null){
          data.map((e) => {
            setWegPunkte((points) => [...(points || [[0, 0, 0]]), [e.x, e.y, e.z]])}
          )
        }
      })

    } else if (wegpunkt1 != null || wegpunkt2 != null) {
      const testWeg = wegBerechnung(wegpunkt1, wegpunkt2)
      testWeg.then((data) => {
        if(data != null){
          data.map((e) => {
            /* angenommen man hat ein objekt=[ ob1: "a", ob2: "b",ob3: "c" ] dann ist {...objekt} das gleiche wie { ob1="a", ob2="b", ob3="c" } */
            setWegPunkte((points) => [...(points || [[0, 0, 0]]), [e.x, e.y, e.z]])}
          )
        }
      })
    } else {
      console.log("error keine wegpunkte ausgewählt")
    }
  }

  const handleaddNumber = (e) => {
    setWegpunkt1(e.target.value);
  };

  const handleaddNumber2 = (e) => {
    setWegpunkt2(e.target.value);
  };

  const handleRadioButtons = (radioName) => {
      if(radioName === "aufzugRadio") {
        setAufzugRadio(true)
        setTreppeRadio(false)
      } else if(radioName === "treppeRadio") {
        setAufzugRadio(false)
        setTreppeRadio(true)
      }
  };
/* Aufruf Wegfinndungsalgorithmus aus Popup   kann gleich raus
  const handleBerechneWegButton = () => {
    setPopupTrigger(false);
    const popupWeg = wegBerechnung(wegpunkt1, wegpunkt2,setTreppeRadio, setAufzugRadio);
    popupWeg.then((data) => {
      if(data != null){
        data.map((e) => {
          setWegPunkte((points) => [...(points || [[0, 0, 0]]), [e.x, e.y, e.z]])}
        )
      }
    })
    console.log(popupWeg)
  }
  */

  // Weg genrieren im UI
  function UiRoute(){
    return(
      <div className="uiRoute">
        <div className='flex'>
          <input
            id= "startpunkt"
            onChange={(e) => handleaddNumber(e)}
            value={wegpunkt1 ? wegpunkt1 : ""}
            type="number"
          />
          <input
            id= "zielpunkt"
            onChange={(e) => handleaddNumber2(e)}
            value={wegpunkt2 ? wegpunkt2 : ""}
            type="number"
          />
        </div>
        
        <div className="treppeAufzug">
        <button    
          type="button"
          onChange={(e) => handleRadioButtons(e.target.id)}
          checked={treppeRadio}
          
          > Treppe </button>

        <button    
          type="button"
          onChange={(e) => handleRadioButtons(e.target.id)}
          checked={aufzugRadio}
          > Aufzug </button>
          
        </div>

        <div className="berechnenButton">
        <button onClick={routeBerechnen}>Route berechnen</button>
        </div>

      </div>
    )
  }

  function LineRenderer({ points }){
    return (
      <>
        <line position={[0, 0, 0]}>
          <bufferGeometry
            onUpdate={(geom) => {
              geom.setFromPoints(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])))
            }}
          />
          <lineBasicMaterial color="green" linewidth={50}/>
        </line>
      </>
    )
  }

  function CameraSelection(){
      if (kamera){
          return <PerspectiveCamera position={[-80, 60, 100]} fov={80} makeDefault={true} />
      }else{
          return <OrthographicCamera position={[-60,10, 0]} fov={0} makeDefault={true} rotation={[0,-90,0]} scale={[0.15,0.15,0.15]} />
      }
  }

    function CameraControls(){
        if (kamera){
            return <OrbitControls enableRotate={true} target={[-60,0,0]}/>
        }else{
            return <OrbitControls enableRotate={false} target={[-60,0, 0]}/>
        }

    }


  return ( 
    <>
    <Canvas>

        <EffectComposer>
            <Vignette eskil={false} offset={0.01} darkness={1} />
            <Outline blendFunction={1} edgeStrength={10.0} visibleEdgeColor={10} hiddenEdgeColor={10} width={10} height={10}/>
        </EffectComposer>

        <CameraSelection />
        <CameraControls />

        <ambientLight 
        intensity={0.5}
        />

        <directionalLight
          castShadow
          shadow-mapSize-height={512}
          shadow-mapSize-width={512}
          intensity={0.8}
        />

        <AddEtage03Geo/>
        <AddEtage03Raeume/>
        <AddEtage02Geo/>
        <AddEtage02Raeume/>
        <AddEtage01Geo/>
        <AddEtage01Raeume/>
        <AddEtage00Geo/>
        <AddEtage00Raeume/>
        <AddStairs/>
        <AddElevators/>
        <AddGround/>

        <LineRenderer points={wegPunkte || [ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0] ]} />

    </Canvas>

    <div className='main'>
      <SwitchCam/>
    </div>

    <div className='main2'>

      <UiRoute/>
    </div>

  </>
  );
};

// 
const App = () => {
  return <Scene />
};


export default App;


    // Array.from generiert einen array mit 3 random werten bzw einen array mit der länge 3 deren werte random sind
    //const next = Array.from({ length: 3 }).map(() => Math.random() * extent * 2 - extent)

    
  /*
  the useThree hook gives you access to the state model which contains
   the default renderer, the scene, your camera, and so on. 
   It also gives you the current size of the canvas in screen and viewport coordinates.
   https://docs.pmnd.rs/react-three-fiber/api/hooks
  */

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
import {MeshClickable, MeshNOTClickable, ImportMeshesFromOBJ} from "./test/MeshFunctions";
import { hover } from '@testing-library/user-event/dist/hover';

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
  const cube = useRef()


  // Gebäude !-Pathfinding ist in der buildingGen.js-!

  function AddEtage_03_Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_03_Raeume.obj",true, "red", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage_03_Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_03_Geo.obj",false, "gray", "", "", raumauswahl, activeRooms)}
  function AddEtage_02_Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_02_Raeume.obj",true, "red", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage_02_Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_02_Geo.obj",false, "gray", "", "", raumauswahl, activeRooms)}
  function AddEtage_01_Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_01_Raeume.obj",true, "red", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage_01_Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_01_Geo.obj",false, "gray", "", "", raumauswahl, activeRooms)}
  function AddEtage_00_Raeume(){
    return ImportMeshesFromOBJ("obj/Main_Etage_00_Raeume.obj",true, "red", "yellow", "green", raumauswahl, activeRooms)}
  function AddEtage_00_Geo(){
    return ImportMeshesFromOBJ("obj/Main_Etage_00_Geo.obj",false, "gray", "", "", raumauswahl, activeRooms)}

  /* Kamera einstellung und erstellung */
  const [kamera, set] = useState(false)

  const test = (kamera ? true : false)

  function changeView(){
    set(!kamera)
  }

  function Counter() {
    return (
      <div className="counter">
        <button onClick={changeView}>Switch cam</button>
      </div>
    )
  }

     /* ALLES MIT LINIEN IST HIER*/

  /* Linien gen https://codesandbox.io/s/r3f-line-adding-points-workaround-11g9h?file=/src/index.js */

  async function wegBerechnung(start, ende){
    const pathMesh = await importPathMesh("obj/PathMesh.obj")
    const pathtest = await findPath(pathMesh[start],pathMesh[ende],pathMesh)
    return pathtest
  }

  // StartMap -> muss generiert werden da sonst ein error kommt
  const dummy_points = Array.from({ length: 5 }).map(() => [0, 0, 0])

  const [wegPunkte, setWegPunkte] = useState(null)

  const activeRooms = []

  function addnewBtn() {

    setWegPunkte(wegPunkte => [])

    const auswahl1 = Number(activeRooms[0])
    const auswahl2 = Number(activeRooms[1])

    console.log(auswahl1, auswahl2)
    
    if (auswahl1 > 0 || auswahl2 > 0) {
      const weg = wegBerechnung(auswahl1, auswahl2)
      weg.then((data) => {
        if(data != null){
          data.map((e) => {
            setWegPunkte((points) => [...(points || [[0, 0, 0]]), [e.x, e.y, e.z]])}
          )
        }
      })

    } else if (wegpunkt1, wegpunkt2 != null) {
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

  const [wegpunkt1, setWegpunkt1] = useState(null);
  const [wegpunkt2, setWegpunkt2] = useState(null);

  const [treppeRadio, setTreppeRadio] = useState(true);
  const [aufzugRadio, setAufzugRadio] = useState(null);
  const [popupTrigger, setPopupTrigger] = useState(null);



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
// Aufruf Wegfinndungsalgorithmus
  const handleBerechneWegButton = () => {
    wegBerechnung(wegpunkt1, wegpunkt2);
    setPopupTrigger(false);
  }

  // Weg genrieren Button mit Popup
  function WegButtonPopup() {
      return (
        <div className='ignore'>
          <div className="WegButton">
           <button onClick={e => setPopupTrigger(true)} >Weg generieren</button> 
           </div>
            {popupTrigger === true &&
            <div className="WegButtonPopup">
              <form>
              <label htmlFor="startPunkt" >Start Raumnummer </label>
            <input
                  id="startPunkt" 
                  onChange={(e) => handleaddNumber(e)}
                  value={wegpunkt1 ? wegpunkt1 : ""}
                  type="number"
                />
                
                </form>
                <form>
                <label htmlFor="endPunkt">Ziel Raumnummer </label>
                <input
                  id="endPunkt" 
                  onChange={(e) => handleaddNumber2(e)}
                  value={wegpunkt2 ? wegpunkt2 : ""}
                  type="number"
                />
                
                </form>
                <form class="formMitPadding">
                <input 
                  type="radio" 
                  id="treppeRadio"   
                  onChange={(e) => handleRadioButtons(e.target.id)}
                  checked={treppeRadio}
                  />
                <label htmlFor="treppeRadio">Treppe</label>
                <input 
                  type="radio" 
                  id="aufzugRadio"   
                  onChange={(e) => handleRadioButtons(e.target.id)}
                  checked={aufzugRadio}
                  />
                <label htmlFor="aufzugRadio">Aufzug</label>
                </form>
                <form>
                
                <button onClick={() => handleBerechneWegButton()}>Weg generieren</button>
                </form>
            </div> 
          }
        
      </div>
      )
  }

  function Thing({ points }){
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

          if ( activeRooms.length == 2 ){
            //const merken
            //addnewBtn()
            console.log("done")

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
 
  // 

  return ( 
    <>
  <Canvas>

      <PerspectiveCamera position={[0, 20, 1.8]} fov={120} makeDefault={!kamera} rotation={[0,-90,0]} enableRotate={test}/>
      <OrbitControls position={[20,40,10]} makeDefault={kamera} enableRotate={test}/>

      <ambientLight 
      intensity={0.5}
      />

      <directionalLight
        castShadow
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
        intensity={0.8}
      />

      <AddEtage_03_Geo/>
      <AddEtage_03_Raeume/>
      <AddEtage_02_Geo/>
      <AddEtage_02_Raeume/>
      <AddEtage_01_Geo/>
      <AddEtage_01_Raeume/>
      <AddEtage_00_Geo/>
      <AddEtage_00_Raeume/>

      <Thing points={wegPunkte || dummy_points} />

    

  </Canvas>

  <div className='main'>
    <Counter/>
  </div>

  <div className='main2'>
    <WegButtonPopup/>
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

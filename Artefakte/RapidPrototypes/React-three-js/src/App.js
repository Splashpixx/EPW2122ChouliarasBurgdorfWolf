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
import {RenderChild, Line} from "./buildingGen"
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

  function AddSingleMesh(){
    const obj = useLoader(OBJLoader, "obj/32xx_full.obj", (loader) => {})

    const listofMashes = []

    obj.children.map(e => {
      listofMashes.push(RenderChild(e))
    })

    return listofMashes.map(e => {
      return e
    })
  }





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

  async function testModul(start, ende){
    const pathMesh = await importPathMesh("obj/pathMesh.obj")
    const pathtest = await findPath(pathMesh[start],pathMesh[ende],pathMesh)
    return pathtest
  }


  // StartMap -> muss generiert werden da sonst ein error kommt
  const dummy_points = Array.from({ length: 5 }).map(() => [0, 0, 0])

  const [wegPunkte, setWegPunkte] = useState(null)

  function addnewBtn() {

    console.log(wegpunkt1, wegpunkt2)

    setWegPunkte(wegPunkte => [])

    const testWeg = testModul(wegpunkt1, wegpunkt2)
    testWeg.then((data) => {
      if(data != null){
        data.map((e) => {
          /* angenommen man hat ein objekt=[ ob1: "a", ob2: "b",ob3: "c" ] dann ist {...objekt} das gleiche wie { ob1="a", ob2="b", ob3="c" } */
          setWegPunkte((points) => [...(points || [[0, 0, 0]]), [e.x, e.y, e.z]])}
        )
      }
    })

  }


  const [wegpunkt1, setWegpunkt1] = useState(null);
  const [wegpunkt2, setWegpunkt2] = useState(null);

  const handleaddNumber = (e) => {
    setWegpunkt1(e.target.value);
  };

  const handleaddNumber2 = (e) => {
    setWegpunkt2(e.target.value);
  };

  function AddNewPointRandom() {
    return (
      <div className="addNewPointRandom">
        <div className='flex'>
          <input
            onChange={(e) => handleaddNumber(e)}
            value={wegpunkt1 ? wegpunkt1 : ""}
            type="number"
          />
          <input
            onChange={(e) => handleaddNumber2(e)}
            value={wegpunkt2 ? wegpunkt2 : ""}
            type="number"
          />
          <button onClick={addnewBtn}>Zeig mir den weg</button>
        </div>
        
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
          <lineBasicMaterial color="red" />
        </line>
      </>
    )
  }

  

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

      <AddSingleMesh/>


      <Thing points={wegPunkte || dummy_points} />

    

  </Canvas>

  <div className='main'>
    <Counter/>
  </div>

  <div className='main2'>
    <AddNewPointRandom/>
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

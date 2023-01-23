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
import { Canvas, extend } from '@react-three/fiber';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";
import React, { useState, useRef, useLayoutEffect, useReducer, Suspense  } from "react";

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


  /* Linien gen https://codesandbox.io/s/r3f-line-adding-points-workaround-11g9h?file=/src/index.js */

  async function testModul(){
    const pathMesh = await importPathMesh("obj/pathMesh.obj")
    const pathtest = await findPath(pathMesh[0],pathMesh[39],pathMesh)
    return pathtest
  }

  
  function Line() {
    
    const points = []
    
    const testx = testModul()
    testx.then((data) => {
      data.map((e) => points.push(e))
    })

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

    return (
        <line geometry={lineGeometry}>
            <lineBasicMaterial attach="material" color={'#9c88ff'} linewidth={100} linecap={'round'} linejoin={'round'} />
        </line>
        )
  }

  function GenerateNewLine(){

    const points = []
    
    const testx = testModul()
    testx.then((data) => {
      data.map((e) => points.push(e))
    })

    console.log(points)
    
    return(
      <>
      <Line points={points} color="blue" linewidth={3} position={[5, 0, 0]} />
      <line position={[0, 0, 0]}>
        <bufferGeometry
          onUpdate={(weg) => {
            weg.setFromPoints(points)
          }}
        />
        <lineBasicMaterial color="red" />
      </line>
      </>
    )
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
      
      <Suspense fallback={null}>
        <GenerateNewLine/>
      </Suspense>
    

  </Canvas>

  <div className='main'>
    <Counter/>
  </div>

  </>
  );
};

// 
const App = () => {
  return <Scene />
};


export default App;

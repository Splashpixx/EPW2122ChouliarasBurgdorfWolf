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
import { useState, useRef, useLayoutEffect, useReducer  } from "react";

// Eigene Scripts //

import {findPath} from "./test/FindPath";
import {importPathMesh} from "./test/ImportPathMesh";
import {RenderChild} from "./buildingGen"
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


  // Punkte
  async function testModul(){

    const pathMesh = await importPathMesh("obj/pathMesh.obj");
    //console.log(pathMesh)
    const pathtest = await findPath(pathMesh[0],pathMesh[32],pathMesh);
    
    return(
      pathtest
    )
  }

  const weg = testModul()


  // Gebäude

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


  /* Linien gen */

  function Line({ start, end }) {
    const ref = useRef()
    

    const points = []

      if(kamera) {
          points.push(new THREE.Vector3(-10, 0, 0))
          points.push(new THREE.Vector3(0, 10, 0))
          points.push(new THREE.Vector3(10, 0, 0))
      } else {
      }

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

      return (
          <line ref={ref} geometry={lineGeometry}>
              <lineBasicMaterial attach="material" color={'#9c88ff'} linewidth={100} linecap={'round'} linejoin={'round'} />
          </line>
          )

    /*Synchrones rendern
    useLayoutEffect(() => {
      ref.current.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)))
    }, [start, end])
    
    return (
      <line ref={ref}>
        <bufferGeometry />
        <lineBasicMaterial color="hotpink" />
      </line>
    )
    */
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
      
    <Line/>

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

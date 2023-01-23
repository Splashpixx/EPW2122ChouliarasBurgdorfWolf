/*
- Nützliche Links -

// https://www.youtube.com/watch?v=kxXaIHi1j4w
// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models
//https://onion2k.github.io/r3f-by-example/examples/hooks/rotating-cube/
//https://codesandbox.io/s/splines-3k4g6?file=/src/Nodes.js:148-265
//https://codesandbox.io/s/basic-clerping-example-qh8vhf?file=/src/Scene.js

*/

import './App.css';
import { Canvas, extend } from '@react-three/fiber';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";
import { useState, useRef, useLayoutEffect  } from "react";

// Eigene Scripts //

import {findPath} from "./test/FindPath";
import {importPathMesh} from "./test/ImportPathMesh";
import {RenderChild} from "./buildingGen"

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

  async function testModul(){

    const pathMesh = await importPathMesh("obj/pathMesh.obj");
    
    const test2 = await findPath(pathMesh[0],pathMesh[32],pathMesh);
    
    return(
      test2
    )
  }

  const weg = testModul()
  console.log(weg)


  // Hier wird das gebäude geladen
  function AddSingleMesh(){
    const obj = useLoader(OBJLoader, "obj/32xx_full.obj", (loader) => {})

    return obj.children.map(e => {
          return RenderChild(e)
      })
  }


  /* Linien gen */

  function Line({ start, end }) {
    const ref = useRef()
    
    //Synchrones rendern
    useLayoutEffect(() => {
      ref.current.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)))
    }, [start, end])
    
    return (
      <line ref={ref}>
        <bufferGeometry />
        <lineBasicMaterial color="hotpink" />
      </line>
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
      
    <Line start={[10,10,10]} end={[20,10,-30]} />

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

// Save for alter https://www.youtube.com/watch?v=LNvn66zJyKs https://onion2k.github.io/r3f-by-example/
// https://codesandbox.io/s/example-f8t3w?file=/src/App.js:4177-4370 // GUI
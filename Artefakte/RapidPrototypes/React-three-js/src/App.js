import './App.css';
// https://www.youtube.com/watch?v=kxXaIHi1j4w
import { Canvas, extend } from '@react-three/fiber';
import glsl from "babel-plugin-glsl/macro"
import { PositionPoint, shaderMaterial } from '@react-three/drei';
import * as THREE from "three";

// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { Children, Suspense, useReducer } from "react";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";

//https://codesandbox.io/s/basic-clerping-example-qh8vhf?file=/src/Scene.js
import { PerspectiveCamera } from "@react-three/drei";
import { Box, Plane, Text } from "@react-three/drei";
import { useEffect, useState, useRef  } from "react";
import { useFrame, useThree } from "@react-three/fiber";

//https://onion2k.github.io/r3f-by-example/examples/hooks/rotating-cube/
import { render } from "react-dom";

//https://codesandbox.io/s/splines-3k4g6?file=/src/Nodes.js:148-265
import { createContext, useMemo, useContext, useLayoutEffect, forwardRef } from 'react'
import { MeshStandardMaterial } from 'three';

import create from 'zustand'
import { Mesh } from "three"
import { useGLTF } from '@react-three/drei'

import { useControls } from 'leva'
import { proxy, useSnapshot } from 'valtio'

// Komentare zu aufbau React, Hooks, algemein comments

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

  //OBJ Loader
  // https://www.youtube.com/watch?v=xy_tbV4pC54
  function Model(props){

    const objRef = useRef()

    const [active, setActive] = useState(false)

    const obj = useLoader(OBJLoader, "obj/32xx_full.obj", (loader) => {})
    
    AddSingleMesh(obj)

    return (
      <mesh>
        <primitive 
          {...props}
          ref={objRef}
          scale={active ? 1.5 : 1}
          onClick={(e) => console.log(obj)}  
          object={obj} 
          />   
        
      </mesh>   
    )
  }

  function AddSingleMesh(){

    const objRef = useRef()
    const [active, setActive] = useState(false)
    const obj = useLoader(OBJLoader, "obj/32xx_full.obj", (loader) => {})

    const items = [  ]

    obj.children.forEach(e => {
        //element["key"] = element.uudi;
        //Object.assign(element, {[key : element.uudi]});
        //console.log(element.uuid)
             
        items.push( 
          <mesh
            scale = {e.scale}
            material = {e.material}
            geometry = {e.geometry}
            material-color = {active ? "green" : "blue"}
            key = {e.id}
          >
          </mesh>
        )
      })

      return(
        //true
        items.map((x) => (x))
      )
  }

  const stateShoe = proxy({
    current: null,
    items: {
     laces: "#ffffff", 
     mesh: "#ffffff",
     caps: "#ffffff",
     inner: "#ffffff", 
     sole: "#ffffff",
     stripes: "#ffffff",
     band: "#ffffff",
     patch: "#ffffff"
    }})

  function ModelShoe(props) {
    const refSh = useRef()
    const { nodes, materials } = useGLTF('/shoe-draco.glb')
    const snap = useSnapshot(stateShoe)

    //const [active, setHover] = useState(false)
    const [active, setActive] = useState(false)

    /*
    useEffect(() => {
      if (active) {
        stateShoe.items[snap.current] = "green"
      } else {
        stateShoe.items[snap.current] = "red"
      }
    }, [active])
    */

    
// color={snap.items[snap.current]} onChange={(color) => (stateShoe.items[snap.current] = color)}  console.log(stateShoe.current = e.object.material.name)
    return (
      <group ref={refSh}

        onClick={(e) => (e.stopPropagation(),  console.log(stateShoe.current = e.object.material.name) , setActive(!active))}
      >
        <mesh color={snap.items.laces }                            geometry={nodes.shoe.geometry}     material={materials.laces}/> 
        <mesh material-color={snap.items.mesh     }                geometry={nodes.shoe_1.geometry}   material={materials.mesh} />
        <mesh material-color={snap.items.caps     }                geometry={nodes.shoe_2.geometry}   material={materials.caps} />
        <mesh material-color={snap.items.inner    }                geometry={nodes.shoe_3.geometry}   material={materials.inner} />
        <mesh material-color={active ? 'green' : snap.items.sole} geometry={nodes.shoe_4.geometry}    material={materials.sole}/>
        <mesh material-color={snap.items.stripes  }               geometry={nodes.shoe_5.geometry}    material={materials.stripes} />
        <mesh material-color={snap.items.band     }               geometry={nodes.shoe_6.geometry}    material={materials.band} />
        <mesh material-color={snap.items.patch    }               geometry={nodes.shoe_7.geometry}    material={materials.patch} />
      </group>
    )
  }

  const arrayWithActiveCubes = []

  function reducer(state, action) {
    
    switch (action.type) {
      case 'increment':
        console.log()
      if(arrayWithActiveCubes.length <= 0){
        arrayWithActiveCubes.push(action.payloade)
      } else {

        var inArray = false
        arrayWithActiveCubes.forEach(element => {
          if(JSON.stringify(element) == JSON.stringify(action.payloade)){
            inArray = true
          }
          });
          if(!inArray){
            arrayWithActiveCubes.push(action.payloade)
          }
      }
      if (arrayWithActiveCubes.length == 2) {
        console.log("done")
       
      }
      console.log(arrayWithActiveCubes)
        return
      case 'decrement':
        
      if(JSON.stringify(arrayWithActiveCubes[0]) == JSON.stringify(action.payloade)){
          arrayWithActiveCubes.splice(0, 1);
      }
      
      if (JSON.stringify(arrayWithActiveCubes[1]) == JSON.stringify(action.payloade)){
        arrayWithActiveCubes.splice(1, 1);
      } 
      console.log(arrayWithActiveCubes)
        return
      default:
        throw new Error();
    }
  }

  function Boxx(props) {
    
    const mesh = useRef()
    
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    const [state, dispatcher] = useReducer(reducer)
    
    useFrame((state, delta) => (mesh.current.rotation.x += delta))

    return (
      <mesh
        {...props}
        ref={mesh}
        scale={active ? 1.5 : 1}
        onClick={() => { setActive(!active) 
          //console.log(obj)
          if(!active){
            dispatcher({type: 'increment', payloade: props.position})
            
          } else {
            dispatcher({type: 'decrement', payloade: props.position})
          }
        }
      }

        
        //Hover
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>

        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={active ? 'green' : 'red' && hovered ? 'yellow' : 'red'} />
        
      </mesh>

    )
  }

// max 2 aussuchen

  function Boxlogic(){
    const [active, setActive] = useState(false)

    const items = [
      <Boxx position={active ? [36.5,13,39.5] : [36.5,12,39.5]}/>,
      <Boxx position={active ? [-6,13,-6]  : [-6,12,-6]}/>
    ]

    console.log(items[1])
    return(
      items.map((x) => (x))
    )
  }


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
      <OrbitControls position={[20,0,10]} makeDefault={kamera} enableRotate={test}/>

      <ambientLight 
      intensity={0.5}
      />

      <directionalLight
        castShadow
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
        intensity={0.8}
      />

      <Suspense fallback={null}>
        <ModelShoe/>
        
        <AddSingleMesh/>
      </Suspense>

    <Boxlogic/>

    

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



/*
<Suspense fallback={null}>
          <primitive 
            object={obj}
            position={[0, 0, 0]}
            
          />
      </Suspense> 


<div className='main'>
    <Counter/>
  </div>
*/
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
import { Suspense, useReducer } from "react";
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

const Scene = () => {
  const cube = useRef()

  //OBJ Loader
    const materials = useLoader(MTLLoader, "obj/testGeo.mtl");
    const obj = useLoader(OBJLoader, "obj/testGeo.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const arrayWithActiveCubes = []


  function reducer(state, action) {
    

    switch (action.type) {
      case 'increment':

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
        onClick={() => {
          setActive(!active) 
          
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

    
    
    return(
      items.map((x) => (x))
    )
  }

  function Line({ start, end }) {
    const ref = useRef()
    
    //rendert erst wenn der rest gerendert wurde
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

     
  return ( 
  <Canvas>
      
      <OrbitControls/>
      
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
          <primitive 
            object={obj}
            position={[0, 0, 0]}
          />
      </Suspense>  

    <Boxlogic/>

    <Line start={[10,10,10]} end={[20,10,-30]} />

  </Canvas>
  );
};

// 
const App = () => {
  return <Scene />
};


export default App;

// Save for alter https://www.youtube.com/watch?v=LNvn66zJyKs https://onion2k.github.io/r3f-by-example/
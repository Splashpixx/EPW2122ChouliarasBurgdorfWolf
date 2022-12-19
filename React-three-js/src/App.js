import './App.css';
// https://www.youtube.com/watch?v=kxXaIHi1j4w
import { Canvas, extend } from '@react-three/fiber';
import glsl from "babel-plugin-glsl/macro"
import { shaderMaterial } from '@react-three/drei';
import * as THREE from "three";

// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

//https://codesandbox.io/s/basic-clerping-example-qh8vhf?file=/src/Scene.js
import { PerspectiveCamera } from "@react-three/drei";
import { Box, Plane, Text } from "@react-three/drei";
import { useEffect, useState, useRef  } from "react";
import { useFrame, useThree } from "@react-three/fiber";


const Scene = () => {
  const cube = useRef()

  var x = "green"

  //OBJ Loader
    const materials = useLoader(MTLLoader, "obj/testGeo.mtl");
    const obj = useLoader(OBJLoader, "obj/testGeo.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

 
  return ( 
  <Canvas>
      
      <OrbitControls makeDefault position={[20, 10, 40]} />
      
      <ambientLight 
      intensity={0.5}
      color={x}
      />
      <directionalLight
        castShadow
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
        intensity={0.8}
      />

      <Text
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        rotation={[0, 0, 0]}
        position={[0, 15, -5]}
        fontSize={2}
      >
        Hello World
      </Text>
      
      <Suspense fallback={null}>
          <primitive 
            object={obj} 
            onClick={(e) => {
              if(x == "green"){
                x = "blue"
              } else {
                x = "green"
              }

              console.log(x)
            
            }}
            onWheel={(e) => console.log('wheel spins')}
          />
          
      </Suspense>  
      
  </Canvas>
  );
};

// 
const App = () => {
  return <Scene />
};


export default App;

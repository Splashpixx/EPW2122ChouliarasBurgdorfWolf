import { Canvas } from "@react-three/fiber"
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";
import {EffectComposer, DepthOfField, Bloom, Noise, Vignette, Outline, Selection, Select} from '@react-three/postprocessing'
import React, { useState, useRef, useLayoutEffect, useReducer, Suspense, useEffect  } from "react";

const Cam = () => {
    const [kamera, set] = useState(true)

    
    function CameraSelection(){
        if (kamera){
            return <PerspectiveCamera position={[-80, 60, 100]} fov={80} makeDefault={true} />
        }else{
            return <OrthographicCamera position={[-60,12, 0]} fov={0} makeDefault={true} rotation={[0,-90,0]} scale={[0.15,0.15,0.15]} />
        }
    }
    
    function CameraControls(){
        if (kamera){
            return <OrbitControls enableRotate={true} target={[-60,0,0]}/>
        }else{
            return <OrbitControls enableRotate={false} target={[-60,0, 0]}/>
        }
    }

    return(
            <>
              <CameraSelection />
              <CameraControls />        
            </>
    )

}

function SwitchCam() {
    return (
      <div className="SwitchCam">
        <button onClick={() => {console.log("Ich hasse React")}}>Switch cam</button>
            
      </div>
    )
}



export {Cam, SwitchCam};
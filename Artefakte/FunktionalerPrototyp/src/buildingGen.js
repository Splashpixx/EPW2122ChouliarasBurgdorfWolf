
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader, useState, useReducer, Suspense  } from "react";
import {findPath} from "./test/FindPath";
import {importPathMesh} from "./test/ImportPathMesh";
import * as THREE from "three";
import {  useRef, useLayoutEffect } from "react";


 
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
        if (activeRooms.length == 2) {
          //console.log("done")
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
  
  function RenderChild(e){
    const [active, setActive] = useState(false)
    const [hovered, setHover] = useState(false)

    const [state, dispatcher] = useReducer(raumauswahl)

    const raumname = "" + e.name
    raumname.slice(-3)
    
    return(
      <mesh
            scale = {e.scale}
            material = {e.material}
            geometry = {e.geometry}
            key = {e.id}
            name = {raumname}
            
            onPointerOver={(event) => {setHover(true); event.stopPropagation()}}

            onPointerOut={(event) => {setHover(false); event.stopPropagation()}}

            onClick={(e) => { setActive(!active)
            active ? dispatcher({type: 'decrement', payloade: raumname.slice(-3)}) : dispatcher({type: 'increment', payloade: raumname.slice(-3)})
            e.stopPropagation()
            }
          }
          >
          <meshStandardMaterial color={active ? 'green' : 'red'  && hovered ? 'yellow' : 'red'} />
      </mesh>
    )
  }




export {RenderChild};
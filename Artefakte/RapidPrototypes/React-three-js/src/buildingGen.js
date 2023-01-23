
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader, useState, useReducer, Suspense  } from "react";
import {findPath} from "./test/FindPath";
import {importPathMesh} from "./test/ImportPathMesh";
import * as THREE from "three";
import {  useRef, useLayoutEffect } from "react";


  // Punkte
  async function testModul(){

    const pathMesh = await importPathMesh("obj/pathMesh.obj");
    //console.log(pathMesh)
    const pathtest = await findPath(pathMesh[0],pathMesh[32],pathMesh);
    return(
      pathtest
    )
  }

  

  async function output(){
    const weg = await testModul()
  }  
  

  /*
  const weg = testModul()

  const pathtest = findPath(weg[0],weg[32],weg);
  
  console.log(weg)
  */
  function Line({ start, end }) {
    const ref = useRef()
    
    const points = [output()]

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

      return (
          <line ref={ref} geometry={lineGeometry}>
              <lineBasicMaterial attach="material" color={'#9c88ff'} linewidth={100} linecap={'round'} linejoin={'round'} />
          </line>
          )
  }


  const arrayWithActiveRooms = []

  // Fügt dem Array über uns den angeklickten vector hinzu
  function raumauswahl(state, action) {

    const vecToArray = [ action.payloade.x, action.payloade.y, action.payloade.z ]
    
    // Increment = Raum ist Aktiv, Decrement = Raum ist inaktiv 
    switch (action.type) {
      case 'increment':
        // wenn unser arrayWithActiveRooms leer ist müssen wir nicht schauen ob es den ausgewählten draum im array doppelt gibt 
        if(arrayWithActiveRooms.length <= 0){
          arrayWithActiveRooms.push(vecToArray)
          } else {
            var inArray = false
            // Geht den array Durch und schaut nach doppelten einträgen
            arrayWithActiveRooms.forEach(element => {
              if(JSON.stringify(element) == JSON.stringify(vecToArray)){
                inArray = true
              }
              });
              if(!inArray){
                arrayWithActiveRooms.push(vecToArray)
              }
          }
        if (arrayWithActiveRooms.length == 2) {
          //console.log("done")
        }
          return
      case 'decrement':
        
        if(JSON.stringify(arrayWithActiveRooms[0]) == JSON.stringify(vecToArray)){
          arrayWithActiveRooms.splice(0, 1);
        }
        
        if (JSON.stringify(arrayWithActiveRooms[1]) == JSON.stringify(vecToArray)){
          arrayWithActiveRooms.splice(1, 1);
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

    //const [checkers, dispatcherTwo] = useReducer(checker)
    
    return(
      <mesh
            scale = {e.scale}
            material = {e.material}
            geometry = {e.geometry}
            key = {e.id}
            
            onPointerOver={(event) => {setHover(true); event.stopPropagation()}}

            onPointerOut={(event) => {setHover(false); event.stopPropagation()}}

            onClick={(e) => { setActive(!active)
            active ? dispatcher({type: 'decrement', payloade: e.point}) : dispatcher({type: 'increment', payloade: e.point})
            }
          }
          >
          <meshStandardMaterial color={active ? 'green' : 'red'  && hovered ? 'yellow' : 'red'} />
      </mesh>
    )
  }

export {RenderChild, Line};
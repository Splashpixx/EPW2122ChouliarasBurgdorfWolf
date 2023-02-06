import React, {useReducer, useState} from "react";
import {useLoader} from "@react-three/fiber";
import {OBJLoader} from "three/addons/loaders/OBJLoader";

const meshcollection = []

function ImportMeshesFromOBJ(path, clickable, baseColor, hoverColor, activeColor, raumauswahl, activeRooms){
    const obj = useLoader(OBJLoader, path, (loader) => {})

    const listofMeshes = []

    obj.children.map(e => {
        listofMeshes.push(RenderChild2(e, clickable, baseColor, hoverColor, activeColor, raumauswahl, activeRooms))
    })

    return listofMeshes.map(e => {
        return e
    })
}

function RenderChild2(e, clickable, baseColor, hoverColor, activeColor, raumauswahl, activeRooms){
    const [active, setActive] = useState(false)
    const [hovered, setHover] = useState(false)
    const [state, dispatcher] = useReducer(raumauswahl)

    const raumname = "" + e.name
    raumname.slice(-3)

    if (clickable){
        return MeshClickable(e.scale, e.geometry, e.id, raumname, baseColor, hoverColor, activeColor, raumauswahl, activeRooms)
    }else{
        return MeshNOTClickable(e.scale, e.geometry, e.id, raumname, baseColor, raumauswahl, activeRooms)
    }
}

function MeshClickable(scale, geometry, id, name, baseColor, hoverColor, activeColor, raumauswahl, activeRooms){

    const [active, setActive] = useState(false)
    const [hovered, setHover] = useState(false)
    const [state, dispatcher] = useReducer(raumauswahl)

    const raumname = "" + name
    raumname.slice(-3)

    const clickableRooms = {
        raumnummer : name.substring(0, 4),
        meshid : raumname.slice(-3)
      }

    meshcollection.push(clickableRooms)

    return(
        <mesh
            scale = {scale}
            geometry = {geometry}
            key = {id}
            name = {name}

            onPointerOver={(event) => {setHover(true); event.stopPropagation()}}

            onPointerOut={(event) => {setHover(false); event.stopPropagation()}}

            onClick={(e) => {
                if(activeRooms.length <= 1){
                    setActive(!active)
                    active ? dispatcher({type: 'decrement', payloade: name}) : dispatcher({type: 'increment', payloade: name})
                } else {
                    setActive(false)
                    dispatcher({type: 'decrement', payloade: name})
                }
                e.stopPropagation()
            }
            }
        >
            <meshStandardMaterial color={active ? activeColor : baseColor  && hovered ? hoverColor : baseColor} />
        </mesh>
    )
}

function MeshNOTClickable(scale,geometry, id, name, baseColor, raumauswahl){

    const [active, setActive] = useState(false)
    const [hovered, setHover] = useState(false)
    const [state, dispatcher] = useReducer(raumauswahl)

    return(
        <mesh
            scale = {scale}
            geometry = {geometry}
            key = {id}
            name = {name}
            onClick={(e) => {}}
        >
            <meshStandardMaterial color={baseColor} />
        </mesh>
    )
}





export {MeshClickable, MeshNOTClickable, ImportMeshesFromOBJ, meshcollection};

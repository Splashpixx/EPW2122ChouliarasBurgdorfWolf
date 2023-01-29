import * as THREE from "three";


function subThreeV3(v1, v2){
    return new THREE.Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
    
}

function normalizeThreeV3(input){
    let length = Math.sqrt((input.x * input.x) + (input.y * input.y)+(input.z * input.z))
    return new THREE.Vector3(input.x/length, input.y/length, input.z/length)
}

async function fetchText(path) {
    let response = await fetch(path);
    return await response.text();
}

export {subThreeV3, normalizeThreeV3, fetchText};
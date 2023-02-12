import * as THREE from "three";

async function findPathSimple(startPoint, endPoint, pathMesh, takeStairs, takeElevator){

    console.log(startPoint)
    console.log(endPoint)

    await setElevationFlags(startPoint, endPoint, pathMesh, takeStairs, takeElevator)

    startPoint.depth = 0

    var currentDepth = 0

    const StopPoint = 1000
    var countforStop = 0

    while (endPoint.depth === null){
        pathMesh.forEach(pathPoint =>{
            if (pathPoint.depth === currentDepth){
                setDepth(pathPoint.edges, pathPoint.depth)
                //console.log(pathPoint)
            }
        })
        currentDepth++
        countforStop++
        if(StopPoint === countforStop){break;}
    }

    let path = await getPath(startPoint, endPoint)
    pathMesh.forEach(pathPoint => {
        pathPoint.prio = null
        pathPoint.depth = null
        pathPoint.endFlag = false
    })
    //console.log(path)
    return path
}

async function findPath(startPoint, endPoint, pathMesh, takeStairs, takeElevator){

    await setElevationFlags(startPoint, endPoint, pathMesh, takeStairs, takeElevator)

    var tookStairs = false

    startPoint.depth = 0

    let currentLoc = startPoint

    const StopPoint = 1000
    var countforStop = 0

    while (currentLoc !== endPoint) {
        // console.log(currentLoc.id)
        
        if(StopPoint === countforStop){
            let path = await getPath(startPoint, endPoint)
            pathMesh.forEach(pathPoint => {
                pathPoint.prio = null
                pathPoint.depth = null
                pathPoint.endFlag = false
            })
            console.log(path)
            return path
            break;
        }

        if(!tookStairs && currentLoc.pos.y === endPoint.pos.y){
            tookStairs = true
            pathMesh.forEach(point =>{
                if(point.stairs === true || point.elevator === true){
                    point.endFlag = true
                }
            })
        }

        await setDepth(currentLoc.edges, currentLoc.depth)

        if (currentLoc.edges.length === 1) {
            if(currentLoc != endPoint){
                currentLoc.endFlag = true
                currentLoc = currentLoc.edges[0].neighbour
            }
        } else {
            await calcPrio(currentLoc.edges,endPoint)
            await sortPrio(currentLoc.edges)

            let newPoint
            try {
                newPoint = currentLoc.edges.find(
                    edge => ((
                        edge.neighbour.endFlag === false &&
                        currentLoc.depth < edge.neighbour.depth
                    ))
                ).neighbour
            } catch (error){
                console.log(error)
                countforStop += 1
            }

            if(newPoint === undefined){
                currentLoc.endFlag = true
                currentLoc = currentLoc.edges.find(
                    edge => (edge.neighbour.depth === currentLoc.depth-1)
                ).neighbour
            } else{
                currentLoc = newPoint
            }
        }
    } // End While

    let path = await getPath(startPoint, endPoint)
    pathMesh.forEach(pathPoint => {
        pathPoint.prio = null
        pathPoint.depth = null
        pathPoint.endFlag = false
    })

    return path
}

async function calcPrio(edges,endPoint) {
    edges.forEach(edge => {
        if (edge.neighbour.prio === null) {
            edge.neighbour.prio = edge.neighbour.pos.distanceTo(endPoint.pos)
            //console.log(edge)
        }
    });
}

async function sortPrio(edges) {
    edges.sort(function (a,b){
        return a.neighbour.prio - b.neighbour.prio;
    });
}

async function setDepth(edges, depthValue){
    edges.forEach(edge =>{
        if(edge.neighbour.depth == null && edge.neighbour.endFlag === false){
            edge.neighbour.depth = (depthValue + 1)
        }
    })
}

async function getPath(startPoint, endPoint){
    let path = []
    let currentPoint = endPoint
    while (currentPoint.depth > 0){

        path.push(currentPoint.pos)

        currentPoint = currentPoint.edges.find(
            edge => (
                (edge.neighbour.depth === currentPoint.depth-1) ||
                (edge.neighbour === startPoint)
            )
        ).neighbour
    }
    path.push(startPoint.pos)
    return path
}

async function setElevationFlags(startPoint, endPoint, pathMesh, takeStairs, takeElevator){

    pathMesh.forEach(element => {
        if (endPoint.pos.y === startPoint.pos.y){
            if(element.stairs || element.elevator){
                element.endFlag = true
            }
        }else{
            if(takeStairs===false){
                pathMesh.forEach(element => {
                    if (element.stairs === true){
                        element.endFlag = true
                    } else {
                        element.prio = 0.000001
                    }
                })
            }
            if(takeElevator===false){
                pathMesh.forEach(element => {
                    if (element.elevator === true){
                        element.endFlag = true
                    } else {
                        element.prio = 0.000001
                    }
                })
            }

            if(endPoint.pos.y > startPoint.pos.y){
                if(element.pos.y < startPoint.pos.y || element.pos.y > endPoint.pos.y){
                    element.endFlag = true
                }
            }
            if(endPoint.pos.y < startPoint.pos.y){
                if(element.pos.y > startPoint.pos.y || element.pos.y < endPoint.pos.y){
                    element.endFlag = true
                }
            }
        }
    })
}


export {findPath, findPathSimple};
async function findPath(startPoint, endPoint, pathMesh, takeStairs, takeElevator){

    if(takeStairs===false){
        pathMesh.forEach(element => {
            if (element.stairs === true){
                element.endFlag = true
            }
        })
    }

    if(takeElevator===false){
        pathMesh.forEach(element => {
            if (element.elevator === true){
                element.endFlag = true
            }
        })
    }

    startPoint.depth = 0

    let currentLoc = startPoint

    while (currentLoc !== endPoint) {
        // console.log(currentLoc.id)

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
    }
    let path = await getPath(startPoint, endPoint)
    pathMesh.forEach(pathPoint => {
        pathPoint.prio = 0
        pathPoint.depth = 0.0
        pathPoint.endFlag = false
    })
    return path
}

async function calcPrio(edges,endPoint) {
    edges.forEach(edge => {
        if (edge.neighbour.prio === 0) {
            edge.neighbour.prio = edge.neighbour.pos.distanceTo(endPoint.pos)
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
        if(edge.neighbour.depth == null){
            edge.neighbour.depth = (depthValue + 1)
        }
    })
}

async function getPath(startPoint, endPoint){
    let path = []
    let currentPoint = endPoint
    while (currentPoint.depth > 0){

        path.push(currentPoint)

        currentPoint = currentPoint.edges.find(
            edge => (
                (edge.neighbour.depth === currentPoint.depth-1 && edge.neighbour.endFlag === false) ||
                (edge.neighbour === startPoint)
            )
        ).neighbour
    }
    path.push(startPoint)
    return path
}
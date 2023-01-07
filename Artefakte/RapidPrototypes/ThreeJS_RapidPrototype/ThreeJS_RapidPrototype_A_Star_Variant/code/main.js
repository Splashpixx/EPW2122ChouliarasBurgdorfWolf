async function main()
{
    const derPath = "obj/pathMesh.obj";
    // const derPath = "obj/pathMesh_TEST.obj";
    let pathMesh = await importPathMesh(derPath);
    console.log(pathMesh)

    const actualPathPoints = [];

    //befüllen des Arrays mit Beispielpunkten, ohne edges, da referenzierung noch nicht möglich
    actualPathPoints.push(new PathMeshPoint(0, new THREE.Vector3(2, 0, 11)))
    actualPathPoints.push(new PathMeshPoint(1, new THREE.Vector3(3, 0, 11)))
    actualPathPoints.push(new PathMeshPoint(2, new THREE.Vector3(3, 5, 11)))
    actualPathPoints.push(new PathMeshPoint(3, new THREE.Vector3(4, 5, 11)))
    actualPathPoints.push(new PathMeshPoint(4, new THREE.Vector3(3, 7, 11)))
    actualPathPoints.push(new PathMeshPoint(5, new THREE.Vector3(3, 7, 1)))
    actualPathPoints.push(new PathMeshPoint(6, new THREE.Vector3(3, 3, 1)))
    actualPathPoints.push(new PathMeshPoint(7, new THREE.Vector3(3, 11, 1)))
    actualPathPoints.push(new PathMeshPoint(8, new THREE.Vector3(4, 11, 1)))

    actualPathPoints[0].edges.push(new Edge(actualPathPoints[1],0))
    actualPathPoints[1].edges.push(new Edge(actualPathPoints[0],0))
    actualPathPoints[1].edges.push(new Edge(actualPathPoints[2],0))
    actualPathPoints[2].edges.push(new Edge(actualPathPoints[1],0))
    actualPathPoints[2].edges.push(new Edge(actualPathPoints[3],0))
    actualPathPoints[2].edges.push(new Edge(actualPathPoints[4],0))
    actualPathPoints[3].edges.push(new Edge(actualPathPoints[2],0))
    actualPathPoints[4].edges.push(new Edge(actualPathPoints[2],0))
    actualPathPoints[4].edges.push(new Edge(actualPathPoints[5],0))
    actualPathPoints[5].edges.push(new Edge(actualPathPoints[6],0))
    actualPathPoints[5].edges.push(new Edge(actualPathPoints[7],0))
    actualPathPoints[6].edges.push(new Edge(actualPathPoints[5],0))
    actualPathPoints[7].edges.push(new Edge(actualPathPoints[5],0))
    actualPathPoints[7].edges.push(new Edge(actualPathPoints[8],0))
    actualPathPoints[8].edges.push(new Edge(actualPathPoints[7],0))

    console.log(actualPathPoints);

// Beispiel Start und Endunte werden aus der Liste ausgewähl

    var path = findPath(actualPathPoints[8], actualPathPoints[0], actualPathPoints)
}

main();
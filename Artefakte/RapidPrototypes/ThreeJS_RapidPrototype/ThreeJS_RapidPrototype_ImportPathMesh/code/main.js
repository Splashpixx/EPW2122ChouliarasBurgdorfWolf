function main(){
  const derPath = "obj/pathMesh.obj";
  let pathMesh = objToPathMeshPoint(derPath);
  console.log(pathMesh)
  console.log(parseInt("010"))
}

async function objToPathMeshPoint(path){
  let objString = await fetchText(path);
  let splitString = objString.split('\n');
  let pointsAndEdges = await returnPointsAndEdgeData(splitString)
  let points = matchNeighbours(pointsAndEdges)
  setStairsOrElevator(points)
  return await points
}

async function fetchText(path) {
  let response = await fetch(path);
  return await response.text();
}

async function returnPointsAndEdgeData(input){
  let points = [];
  let edgeData = [];
  let vIndexCount = 0
  input.forEach(element => {
    if(element[0] == "v"){
      let elementSplit = element.split(" ");
      points.push(new PathMeshPoint(vIndexCount, new THREE.Vector3(elementSplit[1],elementSplit[2],elementSplit[3])))
      vIndexCount++
    }
    if(element[0] == "l"){
      let elementSplit = element.split(" ")
      let id1 = elementSplit[1]
      let id2 = elementSplit[2]
      edgeData.push([parseInt(id1)-1,parseInt(id2)-1])
    }
  });
  return [points, edgeData]
}

async function matchNeighbours(input){
  let meshPoints = input[0]
  let edgeData = input[1]

  // console.log(meshPoints)
  // console.log(edgeData)

  meshPoints.forEach(point => {
    edgeData.forEach(edgeData => {
      if (edgeData[0] == point.id){
        let weight = point.pos.distanceTo(meshPoints[edgeData[1]].pos)
        point.edges.push(new Edge(meshPoints[edgeData[1]], weight))

      }
      if (edgeData[1] == point.id){
        let weight = point.pos.distanceTo(meshPoints[edgeData[0]].pos)
        point.edges.push(new Edge(meshPoints[edgeData[0]], weight))
      }
    })
  })
  return meshPoints
}

function setStairsOrElevator(input){
  return input
}

class PathMeshPoint{
  constructor(id, pos){
    this.id = id;
    this.pos = pos;
    this.edges = [];
    this.endFlag = false;
    this.prio = 0.0;
    this.stairs = false;
    this.elevator = false;
  }
}

class Edge{
  constructor(neighbour, weight) {
    this.neighbour = neighbour;
    this.weight = weight
  }
}

main();
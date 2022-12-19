function pups(){

  // let fs = 1
  // fs += parseInt("3")
  //
  // console.log(fs)
  //
  // const derPath = "obj/BLBLBLBLBL.obj";
  // objToPathMeshPoint(derPath);

  var p1 = new PathMeshPoint1(1, new THREE.Vector3(1,1,1));
  var p2 = new PathMeshPoint1(2, new THREE.Vector3(2,2,2));
  console.log(p1)

  var e1 = new Edge(p2, p1.pos.distanceTo(p2.pos))
  console.log(e1)

  e1.neighbour.id = 5
  e1.neighbour.pos = new THREE.Vector3(9,9,9)
  console.log(p2)

  // p1.edges.push(new Edge(p2,p1.pos.distanceTo(p2.pos)))
  // console.log(p1)


}

async function objToPathMeshPoint(path){
  let objString = await fetchText(path);
  let splitString = objString.split('\n');
  let lonelyPointsAndEdges = await returnLonelyPointsAndEdges(splitString)
  let pointsWithNeighbours = await matchNeighbours(lonelyPointsAndEdges)
  console.log(pointsWithNeighbours)
}

async function matchNeighbours(input){
  let meshPoints = input[0]
  let edges = input[1]

  console.log(meshPoints)
  console.log(edges)

  meshPoints.forEach(point => {
        edges.forEach(edge => {
          if (edge[0] == point.id){
            point.neighbours.push(edge[1])
          }
          if (edge[1] == point.id){
            point.neighbours.push(edge[0])
          }
        })
  })
  return meshPoints
}

async function returnLonelyPointsAndEdges(input){
  let lonelyPoints = [];
  let edges = [];
  let vIndexCount = 0
  input.forEach(element => {
    if(element[0] == "v"){ //LonelyPoints
      let elementSplit = element.split(" ");
      lonelyPoints.push(new PathMeshPoint(vIndexCount, new THREE.Vector3(elementSplit[1],elementSplit[2],elementSplit[3]), []))
      vIndexCount++
    };
    if(element[0] == "l"){ //lines
        let elementSplit = element.split(" ")
        let id1 = elementSplit[1]
        let id2 = elementSplit[2]
        edges.push([parseInt(id1)-1,parseInt(id2)-1])
      };
  });
  return [lonelyPoints, edges]
}

async function fetchText(path) {
  let response = await fetch(path);
  let data = await response.text();
  return data
}

class PathMeshPoint{
  constructor(id, pos, neighbours){
    this.id = id;
    this.pos = pos;
    this.neighbours = neighbours
  }
}

class PathMeshPoint1{
  constructor(id, pos){
    this.id = id;
    this.pos = pos;
    this.edges = [];
    this.endFlagg = false;
  }
}

class Edge{
  constructor(point, distance){
    this.neighbour = point;
    this.weight = distance;
  }
}




pups();
// Erstellen der benötigten Klassen
class Edge {
  constructor(neighbour, weight) {
    this.neighbour = neighbour;
    this.weight = weight;
  }
}

class PathMeshPoint {
  constructor(id, pos) {
    this.id = id;
    this.pos = pos;
    this.edges = [];
    this.endFlag = false;
    this.prio = 0.0;
  }
}

class PathMesh {
  constructor() {
    this.pathMeshPointList = [];
  }
}

function main()
{

// Initialisieren der Variablen, erstmal alle leer
    var startPoint;
    var endPoint;
    var actualLocatioin;

    var previousPathPoint = new PathMeshPoint;

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


// Beispiel Start und Endunte werden aus der Liste ausgewählt
    startPoint = actualPathPoints[0];
    actualLocatioin = startPoint;
    endPoint = actualPathPoints[2];


var i = 0
//Beginn des Loops
    while (actualLocatioin != endPoint && i < 20) {
      i++
      console.log("NEUE WHILE");
      console.log("actualPathPoint " + actualLocatioin.id);
        
        console.log("previousPathPoint " + previousPathPoint.id);

        if (actualLocatioin.edges.length > 1) {

            //Prio und sortierung der Edges des aktuellen Punktes
            calcPrio(actualLocatioin.edges,endPoint)
            //console.log(actualLocatioin.edges)

            sortPrio(actualLocatioin.edges)
            //console.log(actualLocatioin.edges)

            var foundNewPoint = false;
           
                actualLocatioin.edges.every(edges => {
                  if (edges.neighbour.endFlag == false && edges.neighbour != previousPathPoint) {
                        actualLocatioin = edges.neighbour
                        foundNewPoint = true
                        return false;
                    }
                });

              // Falls es außer dem Rückweg nur Sackgassen gibt
              if (foundNewPoint == false) {
                actualLocatioin = previousPathPoint;
              }

        } else {
            //nächster Punkt
            previousPathPoint = actualLocatioin;
            actualLocatioin = actualLocatioin.edges[0].neighbour;
        }


        if (previousPathPoint == actualLocatioin) {
            console.log("Eine Sackgasse wurde errreicht");
            actualLocatioin.endFlag = true;
        }
        

    }

    console.log("Das Ziel wurde errreicht");

}


function calcPrio(edges,goal) {
 edges.forEach(element => {

    if (element.prio == 0) {
      element.prio = element.pos.THREE.distanceTo(goal.pos)
    }
  
 });

}

function sortPrio(edges) {

//    for (var i = 0; i < edges.length; i++) {

//      if (edges[i].neighbour.prio > edges[i + 1].neighbour.prio) {
//        var a = edges[i]
//        var b = edges[i + 1]
//        edges[i] = b
//        edges[i + 1] = a
//        i = 0
//      }
//  }
}

main();
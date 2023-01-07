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


// Beispiel Start und Endunte werden aus der Liste ausgewähl

    findPath(actualPathPoints[8], actualPathPoints[0], actualPathPoints)




}

function findPath(startPoint, endPoint, actualPathPoints){

    var actualLocation = startPoint;
    var previousPathPoint = startPoint

    var i = 0
//Beginn des Loops
    while (actualLocation != endPoint && i < 20) {
        i++
        console.log("NEUE WHILE");
        console.log("actualPathPoint " + actualLocation.id);
        // console.log("previousPathPoint " + previousPathPoint.id);

        if (actualLocation.edges.length > 1) {

            //Prio und sortierung der Edges des aktuellen Punktes
            // console.log("MACH PRIO");
            console.log("RECHNEN")
            calcPrio(actualLocation.edges,endPoint)
            console.log(actualLocation.edges)

            console.log("SORTIEREN")
            sortPrio(actualLocation.edges)
            console.log(actualLocation.edges)

            var foundNewPoint = false;

            actualLocation.edges.some(edges => {
                // console.log("lba " + (edges.neighbour != previousPathPoint))
                if (edges.neighbour.endFlag === false && edges.neighbour != previousPathPoint) {
                    console.log("kommen wir hier rein?")
                    previousPathPoint = actualLocation
                    actualLocation = edges.neighbour
                    foundNewPoint = true
                    return true;
                }
            });
            // Falls es außer dem Rückweg nur Sackgassen gibt
            if (foundNewPoint == false) {
                actualLocation.endFlag = true
                previousPathPoint = actualLocation
                actualLocation = previousPathPoint;
            }

        } else {
            //nächster Punkt
            previousPathPoint = actualLocation;
            actualLocation = actualLocation.edges[0].neighbour;
        }


        if (previousPathPoint == actualLocation) {
            console.log("Eine Sackgasse wurde errreicht");
            actualLocation.endFlag = true;
        }


    }

    console.log("Das Ziel wurde errreicht");

}


function calcPrio(edges,goal) {
    edges.forEach(element => {
        if (element.neighbour.prio == 0) {

          element.neighbour.prio = element.neighbour.pos.distanceTo(goal.pos)
        }
 });
}

function sortPrio(edges) {
    for (var i = 0; i < edges.length-1; i++) {
        let j = i+1
        if (edges[i].neighbour.prio > edges[j].neighbour.prio) {
            var a = edges[i]
            var b = edges[j]
            edges[i] = b
            edges[j] = a
            i = 0
        }
    }
}

main();
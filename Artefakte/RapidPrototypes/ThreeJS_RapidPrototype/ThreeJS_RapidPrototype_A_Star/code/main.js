// Erstellen der benötigten Klassen
class Edge {
  constructor(neighbour, weight) {
    this.neighbour = PathMeshPoint;
    this.weight = 0.0;
  }
}

class PathMeshPoint {
  constructor(id, pos) {
    this.id = 0;
    this.pos = pos;
    this.edges = [];
    this.endFlag = false;
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

    var previousPathPoint;

    const actualPathPoints = [];

    //befüllen des Arrays mit Beispielpunkten
    actualPathPoints.push(new PathMeshPoint(1, new THREE.Vector3(2, 0, 11), [2, 1]))
    actualPathPoints.push(new PathMeshPoint(2, new THREE.Vector3(3, 0, 11), [(1, 1), (3, 5)]))
    actualPathPoints.push(new PathMeshPoint(3, new THREE.Vector3(3, 5, 11), [(2, 5), (4, 1), (5, 2)]))
    actualPathPoints.push(new PathMeshPoint(4, new THREE.Vector3(4, 5, 11), [3, 1]))
    actualPathPoints.push(new PathMeshPoint(5, new THREE.Vector3(3, 7, 11), [(3, 2), (6, 10)]))
    actualPathPoints.push(new PathMeshPoint(6, new THREE.Vector3(3, 7, 1), [(7, 4), (8, 4)]))
    actualPathPoints.push(new PathMeshPoint(7, new THREE.Vector3(3, 3, 1), [6, 4]))
    actualPathPoints.push(new PathMeshPoint(8, new THREE.Vector3(3, 11, 1), [(6, 4), (9, 1)]))
    actualPathPoints.push(new PathMeshPoint(9, new THREE.Vector3(4, 11, 1), [8, 1]))


// Beispiel Start und Endunte werden aus der Liste ausgewählt
    startPoint = actualPathPoints[0];
    actualLocatioin = startPoint;
    endPoint = actualPathPoints[8];


//Beginn des Loops
    while (actualLocatioin = endPoint) {

        console.log(actualLocatioin);
        previousPathPoint = startPoint;

        if (actualLocatioin.edges.length > 1) {

            console.log("hier die priority list abfragen");
            let priorityList = [];

            for (let i = 0; i < actualLocatioin.edges.length; i++) {
                if (actualLocatioin.endFlag = false) {
                    priorityList.push(actualPathPoints[actualLocatioin.Edge[i].id -= 1]);
                }
            }
            actualLocatioin = priorityList[0];
            //hier könnte man den Fall abfangen wenn die Priority liste leer ist, d.h. alle edges haben endflags und es gibt nur Sackgassen

        } else {
            //nächster Punkt, minus eins da der array bei 0 beginnt
            actualLocatioin = actualPathPoints[actualLocatioin.Edge.id -= 1];
        }

        if (previousPathPoint == actualLocatioin) {
            console.log("Eine Sackgasse wurde errreicht");
            actualLocatioin.endFlag = true;
        }

    }

    console.log("Das Ziel wurde errreicht");

}

main();
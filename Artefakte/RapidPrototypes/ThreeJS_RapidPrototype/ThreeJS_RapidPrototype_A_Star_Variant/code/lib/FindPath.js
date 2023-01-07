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

    return 1

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
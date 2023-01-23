class PathMeshPoint{
    constructor(id, pos){
        this.id = id;
        this.pos = pos;
        this.edges = [];
        this.depth = null;
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
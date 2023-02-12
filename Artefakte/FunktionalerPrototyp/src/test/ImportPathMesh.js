import * as THREE from "three";

import {subThreeV3, normalizeThreeV3, fetchText} from "./UtilFunctions";
import "./PathMeshClasses";


class PathMeshPoint{
    constructor(id, pos){
        this.id = id;
        this.pos = pos;
        this.edges = [];
        this.depth = null;
        this.endFlag = false;
        this.prio = null;
        this.stairs = false;
        this.elevator = false;
        this.weight = 0;
    }
}

class Edge{
    constructor(neighbour, weight) {
        this.neighbour = neighbour;
        this.weight = weight
    }
}

async function importPathMesh(path){
    let objString = await fetchText(path);
    let splitString = objString.split('\n');
    let pointsAndEdgesData = await convertToPointsAndEdgesData(splitString)
    let points = await matchNeighbours(pointsAndEdgesData)
    points = await setStairsOrElevator(points)
    return points
}

async function convertToPointsAndEdgesData(input){
    let points = [];
    let edgeData = [];
    let vIndexCount = 0
    input.forEach(element => {
        if(element[0] == "v"){
            let elementSplit = element.split(" ");
            let vecX = parseFloat(elementSplit[1])
            vecX = (Math.round(vecX * 100000) / 100000)
            let vecY = parseFloat(elementSplit[2])
            vecY = (Math.round(vecY * 100000) / 100000)
            let vecZ = parseFloat(elementSplit[3])
            vecZ = (Math.round(vecZ * 100000) / 100000)
            let newPathMeshPoint = new PathMeshPoint(vIndexCount, new THREE.Vector3(vecX,vecY,vecZ))
            points.push(newPathMeshPoint)
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

async function setStairsOrElevator(input){
    input.forEach(meshPoint => {
        if(meshPoint.stairs === false && meshPoint.elevator === false){
            meshPoint.edges.forEach(edge => {
                let dir = subThreeV3(meshPoint.pos,edge.neighbour.pos)
                dir = normalizeThreeV3(dir)
                // console.log(dir)
                if(Math.abs(dir.y) !== 0){
                    if(Math.abs(dir.y) === 1){
                        meshPoint.elevator = true
                    } else {
                        meshPoint.stairs = true
                    }
                }
            })
        }
    })
    return input
}


export {importPathMesh};
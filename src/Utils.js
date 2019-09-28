import {distance} from 'mathjs';

//import { create, all } from 'mathjs';

//const {distance} = require('mathjs');

//const config = { };
//const math = create(all, config);

//const offset = {lat: 37.782, lng: -122.447};


/*testSurfacePoints = [
    [1, 1, 0.1],
    [1, 2, 0.1],
    [2, 1, 0.1],
    [2, 2, 0.1],
    [11, 1, 0.1],
    [11, 2, 0.1],
    [12, 1, 0.2],
    [12, 12, 0.1],
    [11, 11, 0.1],
    [11, 12, 0.1],
    [12, 11, 0.1],
    [12, 12, 0.1],
    [1, 11, 0.1],
    [1, 12, 0.1],
    [2, 11, 0.1],
    [2, 12, 0.1],
];*/

/*
testSurfacePoints = [
    {lat: 37.782, lng: -122.447, weight: 1000},
    {lat: 37.782, lng: -122.445, weight: 800},
    {lat: 37.782, lng: -122.443, weight: 1000},
];*/

//testPoint = [12.5, 0.1, 0];


export function findDistance(pointA, pointB) {
    return distance([pointA.lat, pointA.lng], [pointB.lat, pointB.lng]);
}

/**
 * @return {number}
 */
export function CalculateNearest(point, surfacePoints) {
    let shortestDistancePointIndex = -1;
    let shortestDistance = +Infinity;
    surfacePoints.forEach((item, i) => {
        let currDistance = findDistance(point, item);
        if (currDistance < shortestDistance) {
            shortestDistance = currDistance;
            shortestDistancePointIndex = i;
        }
    });
    
    return shortestDistancePointIndex;
}

export function getSurfacePointStrength(pointIndex, surfacePoints) {
    return surfacePoints[pointIndex].weight;
}

export function estimatePointStrengthFromArray(point, surfacePoints) {
    const shortestDistancePointIndex = CalculateNearest(point, surfacePoints);
    return getSurfacePointStrength(shortestDistancePointIndex, surfacePoints);
}


//console.log('shortestDistancePointIndex', CalculateNearest(testPoint, testSurfacePoints));
//console.log('estimatePointStrengthFromArray', estimatePointStrengthFromArray(testPoint, testSurfacePoints));
const polylineDecoder = require('@mapbox/polyline');

export const sortRoutes = (address, routes) => {

    let routePoints = decodeRoutes(routes.map(x => x.geometry));
    let distances = calculateDisntances(routePoints, address);
    let routeCopy = [...routes];
    for (let i = 0; i < distances.length; i++) {
      routeCopy[i].distance = distances[i];
    }
    routeCopy = mergeSort(routeCopy);

    return routeCopy;
  }

 
 function mergeSort(arr) {
    if (arr.length < 2) {
      return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(
      mergeSort(left),
      mergeSort(right)
    )
  }

  function merge(left, right) {
    let result = []
    let indexLeft = 0
    let indexRight = 0

    while (indexLeft < left.length && indexRight < right.length) {
      if (left[indexLeft].distance < right[indexRight].distance) {
        result.push(left[indexLeft])
        indexLeft++
      } else {
        result.push(right[indexRight])
        indexRight++
      }
    }

    return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))

  }

  function decodeRoutes(routes) {

    let points = [];
    for (let i = 0; i < routes.length; i++) {
      points.push(polylineDecoder.decode(routes[i]));
    }
    return points;
  }

  function calculateDisntances(routePoints, pickUpPoint) {

    const { longitude, latitude } = pickUpPoint;
    let shortestDistances = [];

    for (let i = 0; i < routePoints.length; i++) {
      let shortestDistance = 999999;
      for (let j = 0; j < routePoints[i].length - 1; j++) {
        let x1 = routePoints[i][j][1];
        let y1 = routePoints[i][j][0];
        let x2 = routePoints[i][j + 1][1];
        let y2 = routePoints[i][j + 1][0];

        let distance = distanceToSegment({ x: longitude, y: latitude }, { x: x1, y: y1 }, { x: x2, y: y2 })
        if (distance < shortestDistance) {
          shortestDistance = distance;
        }
      }
      shortestDistances.push(shortestDistance);
    }
    return shortestDistances;
  }

  function distanceBetweenPoints(point1, point2) { return Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2) }

  function distToSegmentSquared(pivot, point1, point2) {
    var l2 = distanceBetweenPoints(point1, point2);
    if (l2 == 0) return distanceBetweenPoints(pivot, point1);
    var t = ((pivot.x - point1.x) * (point2.x - point1.x) + (pivot.y - point1.y) * (point2.y - point1.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return distanceBetweenPoints(pivot, {
      x: point1.x + t * (point2.x - point1.x),
      y: point1.y + t * (point2.y - point1.y)
    });
  }

  function distanceToSegment(pivot, point1, point2) { return Math.sqrt(distToSegmentSquared(pivot, point1, point2)); }

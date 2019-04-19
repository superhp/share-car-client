import { transform } from "ol/proj";
import { routeStyles } from "./mapStyles";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import Polyline from "ol/format/Polyline";

const URL_OSRM_NEAREST = "//cts-maps.northeurope.cloudapp.azure.com/nearest/v1/driving/";
const BEARINGS = "?number=3&bearings=0,20";
const LOCATION_IQ = "//eu1.locationiq.com/v1/reverse.php?key=ad45b0b60450a4&lat=";

export const getNearest = (long, lat) => {
  return new Promise((resolve, reject) => {
    //make sure the coord is on street
    fetch(URL_OSRM_NEAREST + long + "," + lat + BEARINGS)
      .then(response => {
        return response.json();
      })
      .then(function (json) {
        if (json.code === "Ok") {
          resolve(json.waypoints[0].location);
        } else reject();
      });
  });
}

export const coordinatesToLocation = (latitude, longitude) => {
  return new Promise(function (resolve, reject) {
    fetch(
      LOCATION_IQ +
      latitude +
      "&lon=" +
      longitude +
      "&format=json"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        resolve(json);
      }).catch((error)=>{reject(error)});
  });
}

export const centerMap = (long, lat, map) => {
  map.getView().setCenter(transform([long, lat], "EPSG:4326", "EPSG:3857"));
  map.getView().setZoom(13);
}

export const createPointFeature = (long, lat) => {
  const feature = new Feature({
    type: "place",
    geometry: new Point(fromLonLat([long, lat]))
  });
  feature.setStyle(routeStyles.icon);
  return feature;
}

export const createRouteFeature = (geometry) => {
  const route = new Polyline({
    factor: 1e5
  }).readGeometry(geometry, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857"
  });
  const feature = new Feature({
    type: "route",
    geometry: route
  });
  feature.setStyle(routeStyles.route);
  return feature;
}

export const createRoute = (routePoints, direction) => {
  const URL_OSMR_ROUTE = "//cts-maps.northeurope.cloudapp.azure.com/route/v1/driving/";

  var coordinates = "";
  if (direction) {
    for (var i = 0; i < routePoints.length; i++) {
      coordinates += appendCoordinates(routePoints, i)
    }
  } else {
    for (var j = routePoints.length - 1; j >= 0; j--) {
      coordinates += appendCoordinates(routePoints, j)
    }
  }
  coordinates = coordinates.substring(0, coordinates.length-1);
  return fetch(URL_OSMR_ROUTE + coordinates)

    .then(r => {
      return r.json();
    })
    .then(json => {
      if (json.code !== "Ok") {
        throw new Error();
      }
      return json.routes[0].geometry;
    });
}

function appendCoordinates(routePoints, index){
  const point = [routePoints[index].longitude, routePoints[index].latitude];

  var coordinates = point;
    coordinates += ";";
  
  return coordinates;
}
export const fromLonLatToMapCoords = (lon, lat) =>
  transform([parseFloat(lon), parseFloat(lat)], "EPSG:4326", "EPSG:3857");

export const fromMapCoordsToLonLat = (coordinate) =>
  transform([parseFloat(coordinate[0]), parseFloat(coordinate[1])], "EPSG:3857", "EPSG:4326");

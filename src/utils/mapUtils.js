import { transform } from "ol/proj";
import { routeStyles } from "./mapStyles";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import Polyline from "ol/format/Polyline";

const URL_OSRM_NEAREST = "//maps.cts-parking.lt/nearest/v1/driving/";

const NOMINATIM = "//locations.cts-parking.lt/reverse?format=json&lat=";
export const getNearest = (long, lat) => {
    return new Promise((resolve, reject) => {
        //make sure the coord is on street
        fetch(URL_OSRM_NEAREST + long + "," + lat)
            .then(response => {
                return response.json();
            })
            .then(function(json) {
                if (json.code === "Ok") {
                    resolve(json.waypoints[0].location);
                } else reject();
            });
    });
}

export const coordinatesToLocation = (latitude, longitude) => {
    return new Promise(function(resolve, reject) {
        fetch(
                NOMINATIM +
                latitude +
                "&lon=" +
                longitude
            )
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                if (json.address.country !== "Lietuva") {
                    reject();
                }
                resolve(json);
            }).catch((error) => { reject(error) });
    });
}

export const iconType = {
    start: 1,
    finish: 2,
    point: 3
};

export const centerMap = (long, lat, map) => {
    map.getView().setCenter(transform([long, lat], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(13);
}

export const createPointFeature = (long, lat, pointType) => {
    const feature = new Feature({
        type: "place",
        geometry: new Point(fromLonLat([long, lat]))
    });

    if (pointType === iconType.start) {
        feature.setStyle(routeStyles.startIcon);
    } else if (pointType === iconType.finish) {
        feature.setStyle(routeStyles.finishIcon);
    } else if (pointType === iconType.point) {
        feature.setStyle(routeStyles.pointIcon);
    }

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
    const URL_OSMR_ROUTE = "//maps.cts-parking.lt/route/v1/driving/";

    var coordinates = "";
    for (var i = 0; i < routePoints.length; i++) {
        coordinates += appendCoordinates(routePoints, i)
    }

    coordinates = coordinates.substring(0, coordinates.length - 1);
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

function appendCoordinates(routePoints, index) {
    const point = [routePoints[index].longitude, routePoints[index].latitude];

    var coordinates = point;
    coordinates += ";";

    return coordinates;
}
export const fromLonLatToMapCoords = (lon, lat) =>
    transform([parseFloat(lon), parseFloat(lat)], "EPSG:4326", "EPSG:3857");

export const fromMapCoordsToLonLat = (coordinate) =>
    transform([parseFloat(coordinate[0]), parseFloat(coordinate[1])], "EPSG:3857", "EPSG:4326");
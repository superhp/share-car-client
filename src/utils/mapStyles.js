import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import point from "../images/point.png";
import start from "../images/start-flag.ico";
import finish from "../images/finish-flag.ico";


export const routeStyles = {
    route: new Style({
        stroke: new Stroke({
            width: 6,
            color: [40, 40, 40, 0.8]
        })
    }),
    startIcon: new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: start
        })
    }),
    finishIcon: new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: finish
        })
    }),
    pointIcon: new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: point
        })
    })
};

export const selectedRouteStyle = {
    route: new Style({
        stroke: new Stroke({
            width: 6,
            color: [0, 200, 0, 0.8]
        }),
        zIndex: 10
    })
};
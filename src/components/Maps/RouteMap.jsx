// @flow
import * as React from "react";
import { transform } from "ol/proj";
import Map from "ol/Map";
import SourceVector from "ol/source/Vector";
import LayerVector from "ol/layer/Vector";
import View from "ol/View";
import Feature from "ol/Feature";
import Tile from "ol/layer/Tile";
import Point from "ol/geom/Point";
import OSM from "ol/source/OSM";
import "../../styles/routeMap.css";
import "../../styles/genericStyles.css";
import Done from "@material-ui/icons/Done";
import Clear from "@material-ui/icons/Clear";
import { addressToString, fromLocationIqResponse } from "../../utils/addressUtils";
import {
    fromLonLatToMapCoords, fromMapCoordsToLonLat,
    getNearest, coordinatesToLocation, createPointFeature,
    createRouteFeature, createRoute
} from "../../utils/mapUtils";

export default class RouteMap extends React.Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            address: null,
            coordinates: [],
            map: null,
            Vector: null,
            routePoints: this.props.routePoints,
            editableFeature: null,
            routeFeature: null,
        };
    }

    componentDidMount() {
        const { map, vectorSource } = this.initializeMap();
        this.map = map;
        this.vectorSource = vectorSource;
        this.displayRoutePoints();
        this.displayRoute();
    }

    initializeMap() {
        const vectorSource = new SourceVector();
        const vectorLayer = new LayerVector({ source: vectorSource });
        const map = new Map({
            target: "map",
            controls: [],
            layers: [
                new Tile({
                    source: new OSM()
                }),
                vectorLayer
            ],
            view: new View({
                center: fromLonLatToMapCoords(25.279652, 54.687157),
                zoom: 13
            })
        });
        map.on("click", e => {
            const [longitude, latitude] = fromMapCoordsToLonLat(e.coordinate);
            this.handleMapClick(longitude, latitude);
        });
        setTimeout(() => { this.map.updateSize(); }, 200);
        return { map, vectorSource };
    }

    handleMapClick(longitude, latitude) {
        getNearest(longitude, latitude)
            .then(([long, lat]) => coordinatesToLocation(lat, long))
            .then(response => {
                const address = fromLocationIqResponse(response);
                address.longitude = longitude;
                address.latitude = latitude;
                this.setState({ address }, this.addNewRoutePoint)
            }).catch();
    }

    setPickUpPointFeature() {
        const { address, editableFeature } = this.state;
        if (address) {
            const { longitude, latitude } = address;
            let feature = createPointFeature(longitude, latitude);
            if (editableFeature) {
                this.vectorSource.removeFeature(editableFeature);
            }
            this.vectorSource.addFeature(feature);
            this.setState({ editableFeature: feature });
        }
    }

    addNewRoutePoint() {
        const { address, editableFeature } = this.state;
        const { longitude, latitude } = address;
        const feature = createPointFeature(longitude, latitude);
        if (editableFeature) {
            this.vectorSource.removeFeature(editableFeature);
        }
        this.vectorSource.addFeature(feature);
        let points = [...this.state.routePoints];
        points[this.props.routePointIndex] = {
            address: address,
            feature: feature,
            displayName: addressToString(address),
            routePointType: this.props.routePointType
        };

        this.setState({ routePoints: points, editableFeature: feature }, () => { this.displayRoute() });
    }

    displayRoutePoints() {
        const { routePoints } = this.state;
        const points = routePoints.filter(x => x.address).map(x => x.address);
        for (let i = 0; i < routePoints.length; i++) {
            if (routePoints[i].address) {
                const { longitude, latitude } = routePoints[i].address;
                const feature = createPointFeature(longitude, latitude);
                if (this.props.routePointIndex < this.props.routePoints.length && i === this.props.routePointIndex) {
                 this.setState({editableFeature:feature});   
                }
                this.vectorSource.addFeature(feature);
            }
        };
    }

    displayRoute() {
        const { routePoints, routeFeature } = this.state;
        const points = routePoints.filter(x => x.address).map(x => x.address);
        if (routeFeature) {
            this.vectorSource.removeFeature(routeFeature);
        }
        if (points.length > 1) {
            createRoute(points, this.props.isRouteToOffice)
                .then(geometry => {
                    const routeFeature = createRouteFeature(geometry)
                    this.vectorSource.addFeature(routeFeature);
                    this.setState({ routeFeature: routeFeature });
                });
        }
    }

    render() {
        return (
            <div>
                <div className="navigation">
                    <div className="return">
                        <div className="generic-button return-icon" onClick={() => { this.props.return() }}>
                            <Clear />
                        </div>
                    </div>
                    <div className="label">Tap on the screen</div>
                    <div className="select">
                        <div className={this.state.address
                            ? "generic-button select-icon"
                            : "generic-button select-icon disabled"} onClick={() => { this.props.return(this.state.address) }}>
                            <Done />
                        </div>
                    </div>
                </div>
                <div id="map"></div>
            </div>
        );
    }
}

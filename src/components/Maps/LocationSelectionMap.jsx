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
import "../../styles/locationSelectionMap.css";
import "../../styles/genericStyles.css";
import { AddressInput } from "../common/AddressInput";
import { formAlgoliaAddress } from "../../utils/addressUtils";
import Done from "@material-ui/icons/Done";
import Clear from "@material-ui/icons/Clear";
import { addressToString, fromLocationIqResponse } from "../../utils/addressUtils";
import {
    fromLonLatToMapCoords, fromMapCoordsToLonLat,
    getNearest, coordinatesToLocation, createPointFeature,
    createRouteFeature, createRoute, iconType,centerMap
} from "../../utils/mapUtils";
import { routePointType } from "../../utils/routePointTypes";

export default class LocationSelectionMap extends React.Component<{}> {
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
        if (this.props.driver) {
            this.displayRoute();
        }
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
                this.setState({ address }, () => this.addNewRoutePoint())
            }).catch();
    }

    addNewRoutePoint() {
        const { address, editableFeature } = this.state;
        const { longitude, latitude } = address;
        const { routePointIndex, routePoints } = this.props;
        let feature;
        if (routePointIndex === 0) {
            feature = createPointFeature(longitude, latitude, iconType.start);
        } else {
            if (routePointIndex === routePoints.length - 1) {
                feature = createPointFeature(longitude, latitude, iconType.finish);
            } else {
                feature = createPointFeature(longitude, latitude, iconType.point);
            }
        }
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
        this.setState({ routePoints: points, editableFeature: feature }, () => { if (this.props.driver) { this.displayRoute() } });
    }

    displayRoutePoints() {
        const { routePoints } = this.state;
        console.log(routePoints)
        const points = routePoints.filter(x => x.address).map(x => x.address);
        for (let i = 0; i < routePoints.length; i++) {
            if (routePoints[i].address) {
                const { longitude, latitude } = routePoints[i].address;
                let feature;
                if (i === 0) {
                    feature = createPointFeature(longitude, latitude, iconType.start);
                } else {
                    if (i === routePoints.length - 1) {
                        feature = createPointFeature(longitude, latitude, iconType.finish);
                    } else {
                        feature = createPointFeature(longitude, latitude, iconType.point);
                    }
                }
                if (this.props.routePointIndex < this.props.routePoints.length && i === this.props.routePointIndex) {
                    this.setState({ editableFeature: feature });
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
            createRoute(points)
                .then(geometry => {
                    const routeFeature = createRouteFeature(geometry)
                    this.vectorSource.addFeature(routeFeature);
                    this.setState({ routeFeature: routeFeature });
                });
        }
    }
    changeRoutePoint(address) {
            let routePoints = [...this.state.routePoints];
            routePoints[0] = {
                address: address,
                displayName: addressToString(address),
                routePointType: routePointType.first
            }
            centerMap(address.longitude, address.latitude, this.map);
            this.setState({ routePoints: routePoints}, () => this.displayRoutePoints() );
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
                {
                    this.props.homeAddress
                        ? <AddressInput
                            onClick={() => { }}
                            key={0}
                            index={0}
                            deletable={false}
                            removeRoutePoint={id => { }}
                            placeholder="Select location"
                            onChange={(suggestion, index) => this.changeRoutePoint(formAlgoliaAddress(suggestion))}
                            displayName={this.state.routePoints.length > 0 ? this.state.routePoints[0].displayName : null}
                        />
                        : null
                }
                <div id="map"></div>
            </div>
        );
    }
}

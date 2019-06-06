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
import { fromLocationIqResponse } from "../../utils/addressUtils";

import {
    fromLonLatToMapCoords, fromMapCoordsToLonLat,
    getNearest, coordinatesToLocation, createPointFeature,
    createRouteFeature
  } from "../../utils/mapUtils";
export default class RouteMap extends React.Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            address:null,
            coordinates: [],
            map: null,
            Vector: null
        };
    }

    componentDidMount() {
        const { map, vectorSource } = this.initializeMap();
        this.map = map;
        this.vectorSource = vectorSource;
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
          setTimeout(() => { this.map.updateSize(); }, 1000);
          return { map, vectorSource };
    }

    handleMapClick(longitude, latitude) {
        getNearest(longitude, latitude)
          .then(([long, lat]) => coordinatesToLocation(lat, long))
          .then(response => {
            const address = fromLocationIqResponse(response);
            address.longitude = longitude;
            address.latitude = latitude;
            this.setState({ address }, this.setPickUpPointFeature)
          }).catch();
      }

      setPickUpPointFeature() {
        const { address } = this.state;
        if (address) {
          const { longitude, latitude } = address;
          let feature = createPointFeature(longitude, latitude);
          this.vectorSource.clear();
            this.vectorSource.addFeature(feature);
        }
      }

    render() {
        return (
            <div>
                <div className="navigation">
                    <div className="return">
                    <div className="generic-button return-icon" onClick={() => {this.props.return()}}>
                        <Clear />
                        </div>
                    </div>
                    <div className="label">Tap on the screen</div>
                    <div className="select">
                    <div className={this.state.address 
                        ? "generic-button select-icon" 
                        : "generic-button select-icon disabled"} onClick={() => {this.props.return(this.state.address)}}>
                        <Done />
                        </div>
                    </div>
                </div>
                <div id="map"></div>
            </div>
        );
    }
}

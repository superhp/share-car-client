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

import { centerMap, fromLonLatToMapCoords, createPointFeature, createRouteFeature } from "../../utils/mapUtils";

import "../../styles/mapComponent.css";

export default class MapComponent extends React.Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: [],
      map: null,
      Vector: null
    };
  }

  // passes coordinates up to parent
  updateCoordinates() {
    this.props.onUpdate(this.state.coordinates);
  }

  // Shows passenger pick up point 
  setPassengersPickUpPoint(val, map) {
    centerMap(val[0], val[1], map);
    let xy = [];
    xy = transform(val, "EPSG:4326", "EPSG:3857");
    let vectorSource = this.state.Vector;
    const feature = new Feature(new Point(xy));

    vectorSource.clear();
    vectorSource.addFeature(feature);
  }

  displayNewRoute(geometry) {
    const newRouteFeature = createRouteFeature(geometry)
    this.vectorSource.addFeature(newRouteFeature);
  }

  componentDidMount() {
    const vectorSource = new SourceVector();
    const vectorLayer = new LayerVector({ source: vectorSource });
    const { pickUpPoint, route} = this.props;
    const map = new Map({
      target: "map" + this.props.index,
      controls: [],
      layers: [
        new Tile({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLatToMapCoords(pickUpPoint.longitude, pickUpPoint.latitude),
        zoom: 12
      })
    });

    const f1 = createPointFeature(pickUpPoint.longitude, pickUpPoint.latitude);
    const f2 = createPointFeature(route.fromAddress.longitude, route.fromAddress.latitude);
    const f3 = createPointFeature(route.toAddress.longitude, route.toAddress.latitude);
    const f4 = createRouteFeature(route.geometry);
    vectorSource.addFeature(f1);
    vectorSource.addFeature(f2);
    vectorSource.addFeature(f3);
    vectorSource.addFeature(f4);
  }

  render() {
    return (
      <div>
          <div id={"map" + this.props.index} className="map" />
      </div>
    );
  }
}

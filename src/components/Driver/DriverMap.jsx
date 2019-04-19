import * as React from "react";
import Map from "ol/Map";
import View from "ol/View";
import SourceVector from "ol/source/Vector";
import LayerVector from "ol/layer/Vector";
import Tile from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Button from "@material-ui/core/Button";
import { OfficeAddresses } from "../../utils/AddressData";
import RidesScheduler from "./Ride/RidesScheduler";
import { DriverRouteInput } from "./Map/DriverRouteInput";
import {
  fromLonLatToMapCoords, fromMapCoordsToLonLat,
  getNearest, coordinatesToLocation,
  createPointFeature, createRouteFeature,
  createRoute
} from "./../../utils/mapUtils";
import { addressToString, fromLocationIqResponse } from "../../utils/addressUtils";

import "./../../styles/testmap.css";

export class DriverMap extends React.Component {
  constructor(props) {
    super(props);
    this.autocompleteInputs = [];
  }

  state = {
    isRideSchedulerVisible: false,
    isRouteToOffice: true,
    routeGeometry: null, // only needed to prevent duplicate calls for RidesScheduler
    routePoints: [],
    routePolylineFeature: null,
    currentOffice: OfficeAddresses[0],
  };

  componentDidMount() {
    const { map, vectorSource } = this.initializeMap();
    this.map = map;
    this.vectorSource = vectorSource;
    this.addNewRoutePoint(OfficeAddresses[0])

  }

  componentWillReceiveProps(nextProps) {
    this.vectorSource.clear();
    this.setState({
      isRideSchedulerVisible: false,
      routeGeometry: null,
      routePoints: [],
      routePolylineFeature: null,
    }, () => {
      this.addNewRoutePoint(this.state.currentOffice)
    });
  }

  officeSelectionChange(address, inputFieldIndex) {
    this.setState({ currentOffice: address });
    this.changeRoutePoint(address, inputFieldIndex);
  }

  // index => index of input field representing route point. Since First Route Point is office (and there is no input field for office) index must be incermented
  changeRoutePoint(address, index) {
    if (address) {
      index++;
      const { longitude, latitude } = address
      let routePoints = this.state.routePoints;
      if (index >= routePoints.length) {
        this.addNewRoutePoint(address);
      } else {
        this.vectorSource.removeFeature(routePoints[index].feature);
        const feature = createPointFeature(longitude, latitude);
        this.vectorSource.addFeature(feature);
        routePoints[index] = { address: address, feature: feature, displayName: addressToString(address) }
        this.setState({ routePoints: routePoints }, this.displayNewRoute);
      }
    }
  }

  handleMapClick(longitude, latitude) {
    return getNearest(longitude, latitude)
      .then(([long, lat]) => coordinatesToLocation(lat, long))
      .then(response => {
        if (!response.address) {
          return;
        } else {
          let address = fromLocationIqResponse(response);
          address.longitude = longitude;
          address.latitude = latitude;

          if (this.state.isRouteToOffice) {
            this.addNewRoutePoint(address);
          } else {
            this.addNewRoutePoint(address);
          }
        }
      }).catch(error => { });
  }

  addNewRoutePoint(address) {
    const { longitude, latitude } = address;
    const feature = createPointFeature(longitude, latitude);
    this.vectorSource.addFeature(feature);
    this.setState({ routePoints: [...this.state.routePoints, { address: address, feature: feature, displayName: addressToString(address) }] }, () => {
      if (this.state.routePoints.length > 1) {
        this.displayNewRoute();
      }
    });
  }

  displayNewRoute() {
    let points = this.state.routePoints.map(a => a.address);
    if (points.length === 1) {
      if (this.state.routePolylineFeature) {
        this.vectorSource.removeFeature(this.state.routePolylineFeature);
        this.setState({ routePolylineFeature: null });
      }
    } else {
      createRoute(points, this.state.isRouteToOffice)
        .then(geometry => {
          if (this.state.routePolylineFeature) {
            this.vectorSource.removeFeature(this.state.routePolylineFeature);
          }
          const newRouteFeature = createRouteFeature(geometry)
          this.vectorSource.addFeature(newRouteFeature);
          this.setState({ routeGeometry: geometry, routePolylineFeature: newRouteFeature });
        });
    }
  }

  // index => index of input field representing route point. Since First Route Point is office (and there is no input field for office) index must be incermented
  removeRoutePoint(index) {
    let routePoints = this.state.routePoints;

    this.vectorSource.removeFeature(this.state.routePoints[index + 1].feature);

    routePoints.splice(index + 1, 1);
    this.setState({ routePoints: routePoints }, this.displayNewRoute);
  }

  handleDirectionChange() {
    this.setState({ isRouteToOffice: !this.state.isRouteToOffice }, this.displayNewRoute);
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

  render() {
    return (

      <div>
        {this.autocompleteInputs = []}
        <div className="displayRoutes">
          <DriverRouteInput
            officeSelectionChange={(address, inputIndex, officeIndex) => this.officeSelectionChange(address, inputIndex, officeIndex)}
            changeRoutePoint={(address, index) => this.changeRoutePoint(address, index)}
            changeDirection={() => this.handleDirectionChange()}
            routePoints={this.state.routePoints}
            removeRoutePoint={index => this.removeRoutePoint(index)}
            isRouteToOffice={this.state.isRouteToOffice}
          />
        </div>
        <div id="map"></div>
        {this.state.isRideSchedulerVisible ? (
          <RidesScheduler routeInfo={{
            fromAddress: this.state.isRouteToOffice ? this.state.routePoints[this.state.routePoints.length - 1].address : this.state.routePoints[0].address,
            toAddress: this.state.isRouteToOffice ? this.state.routePoints[0].address : this.state.routePoints[this.state.routePoints.length - 1].address,
            routeGeometry: this.state.routeGeometry
          }} />
        ) : null}
        <Button
          disabled={this.state.routePoints.length < 2}
          className="continue-button"
          variant="contained"
          onClick={() => this.setState({ isRideSchedulerVisible: !this.state.isRideSchedulerVisible })}
        >
          Continue
        </Button>
      </div>
    );
  }
}

export default DriverMap;
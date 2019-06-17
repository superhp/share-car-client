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
import LocationSelection from "../Maps/LocationSelection";
import {
  fromLonLatToMapCoords, fromMapCoordsToLonLat,
  getNearest, coordinatesToLocation,
  createPointFeature, createRouteFeature,
  createRoute
} from "./../../utils/mapUtils";
import { addressToString, fromLocationIqResponse } from "../../utils/addressUtils";

import "./../../styles/testmap.css";
import RouteSelection from "../Maps/RouteSelection";
import RouteMap from "../Maps/RouteMap";
import { routePointType } from "../../utils/routePointTypes";
import api from "../../helpers/axiosHelper";
import SnackBars from "../common/Snackbars";
import { SnackbarVariants, showSnackBar } from "../../utils/SnackBarUtils"

const currentComponent = {
  fullMap: 0,
  locationSelection: 1,
  addPointMap: 2,
}

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
    currentRoutePoint: { index: 0, routePointType: routePointType.first, displayName: null },
    currentComponent: currentComponent.FullMap,
    homeAddressSelection: false,
    homeAddress: null,
    snackBarClicked: false,
    snackBarMessage: null,
    snackBarVariant: null,
  };

  componentDidMount() {
    const { map, vectorSource } = this.initializeMap();
    this.map = map;
    this.vectorSource = vectorSource;
    api.get(`User/homeAddress`).then(response => {
      if (response.data !== null) {
        let address = {
          address: response.data,
          displayName: addressToString(response.data),
        };
        this.setState({ homeAddress: address });
      }
    })
      .catch(() => {
        showSnackBar("Failed to get home address", 2, this);
      });
  }

  componentWillReceiveProps(nextProps) {
    this.vectorSource.clear();
    this.setState({
      isRideSchedulerVisible: false,
      routeGeometry: null,
      routePoints: [],
      currentComponent: currentComponent.FullMap,
      routePolylineFeature: null,
      homeAddressSelection: false,
      homeAddress: null,
      snackBarClicked: false,
      snackBarMessage: null,
      snackBarVariant: null,
    });
  }

  // index => index of input field representing route point. Since First Route Point is office (and there is no input field for office) index must be incermented
  changeRoutePoint(address, index) {
    if (address) {
      const { longitude, latitude } = address
      let routePoints = [...this.state.routePoints];
      const feature = createPointFeature(longitude, latitude);
      this.vectorSource.addFeature(feature);
      routePoints[index] = {
        address: address,
        feature: feature,
        displayName: addressToString(address),
        routePointType: this.state.currentRoutePoint.routePointType
      }
      this.setState({ routePoints: routePoints }, () => { this.updateMap() });
    }
  }
  addNewRoutePoint(address, index) {
    index++;
    const { longitude, latitude } = address;
    const feature = createPointFeature(longitude, latitude);
    let points = [...this.state.routePoints];
    points.splice(index, 0, {
      address: address,
      feature: feature,
      displayName: addressToString(address),
      routePointType: this.state.currentRoutePoint.routePointType
    });

    this.setState({ routePoints: points }, () => { this.updateMap() });
  }

  updateMap() {
    const { routePoints } = this.state;

    const points = routePoints.filter(x => x.address).map(x => x.address);
    routePoints.forEach(x => {
      if (x.address) {
        const { longitude, latitude } = x.address;
        const feature = createPointFeature(longitude, latitude);
        this.vectorSource.addFeature(feature);
      }
    });
    if (points.length > 1) {
      createRoute(points, this.state.isRouteToOffice)
        .then(geometry => {
          const routeFeature = createRouteFeature(geometry)
          this.vectorSource.addFeature(routeFeature);
          this.setState({ routeGeometry: geometry });
        });
    }
  }


  // index => index of input field representing route point. Since First Route Point is office (and there is no input field for office) index must be incermented
  removeRoutePoint(index) {
    let routePoints = [...this.state.routePoints];

    this.vectorSource.clear();
    routePoints.splice(index + 1, 1);
    this.setState({ routePoints: routePoints }, () => { this.updateMap() });
  }

  // handleDirectionChange() {
  //   this.setState({ isRouteToOffice: !this.state.isRouteToOffice }, this.displayNewRoute);
  //}

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

    setTimeout(() => { this.map.updateSize(); }, 200);

    return { map, vectorSource };
  }

  updateHomeAddress(address) {
    api.post(`User/updateHomeAddress`, address).then(response => {
      let stateAddress = {
        address: address,
        displayName: addressToString(address)
      }
        this.setState({ currentComponent: currentComponent.locationSelection, homeAddress: stateAddress, homeAddressSelection: false });
    }).catch(() => {
      showSnackBar("Failed to set home address", 2, this);
      this.setState({ currentComponent: currentComponent.locationSelection, homeAddressSelection: false });
    });

  }

  selectLocation(address) {
    this.setState({ currentComponent: currentComponent.FullMap }, () => {
      const { routePoints, currentRoutePoint } = this.state;
      const { map, vectorSource } = this.initializeMap();
      this.map = map;
      this.vectorSource = vectorSource;
      if (!address) {
        this.updateMap();
        return;
      }
      if (currentRoutePoint.routePointType === routePointType.first) {
        if (routePoints.length > 0 && routePoints[0].routePointType === routePointType.first) {
          this.changeRoutePoint(address, currentRoutePoint.index);
        } else {
          this.addNewRoutePoint(address, currentRoutePoint.index);
        }
      } else if (currentRoutePoint.routePointType === routePointType.last) {
        if (routePoints.length > 0 && routePoints[routePoints.length - 1].routePointType === routePointType.last) {
          this.changeRoutePoint(address, currentRoutePoint.index);
        } else {
          this.addNewRoutePoint(address, currentRoutePoint.index);
        }
      } else {
        if (routePoints[currentRoutePoint.index].routePointType === routePointType.intermediate) {
          this.changeRoutePoint(address, currentRoutePoint.index);
        } else {
          this.addNewRoutePoint(address, currentRoutePoint.index);
        }
      }
    });
  }

  showLocationSelection(routePointIndex, routePointType) {
    const { routePoints } = this.state;
    this.setState({
      currentComponent: currentComponent.locationSelection,
      currentRoutePoint: {
        index: routePointIndex,
        routePointType: routePointType,
        displayName: routePoints[routePointIndex] ? routePoints[routePointIndex].displayName : null
      }
    })
  }

  addEmptyRoutePoint() {
    const { routePoints } = this.state;
    if (routePoints.length > 0) {
      let points = [...this.state.routePoints];
      points.splice(1, 0, {
        address: null,
        feature: null,
        displayName: null,
        routePointType: routePointType.intermediate
      });
      this.setState({ routePoints: points });
    }
  }

  render() {
    return (

      <div>
        {
          this.state.currentComponent === currentComponent.FullMap
            ? <div>
              {this.autocompleteInputs = []}

              <div className="routes">
                <RouteSelection
                  officeSelectionChange={(address, inputIndex, officeIndex) => this.officeSelectionChange(address, inputIndex, officeIndex)}
                  changeDirection={() => this.handleDirectionChange()}
                  routePoints={this.state.routePoints}
                  //  removeRoutePoint={index => this.removeRoutePoint(index)}
                  addNewRoutePoint={() => this.addEmptyRoutePoint()}
                  isRouteToOffice={this.state.isRouteToOffice}
                  showLocationSelection={(routePointIndex, routePointType) => { this.showLocationSelection(routePointIndex, routePointType) }}
                />


              </div>
              <div id="map"></div>
              {/*
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
        </Button>*/}


            </div>
            : <div>
              {this.state.currentComponent === currentComponent.locationSelection
                ? <LocationSelection
                  showRouteMap={() => { this.setState({ currentComponent: currentComponent.addPointMap }) }}
                  selectHomeAddress={() => { this.setState({ currentComponent: currentComponent.addPointMap, homeAddressSelection: true }) }}
                  selectLocation={(address) => { this.selectLocation(address) }}
                  currentRoutePoint={this.state.currentRoutePoint}
                  homeAddress={this.state.homeAddress}
                />
                : this.state.homeAddressSelection
                  ? <RouteMap
                    routePoints={[this.state.homeAddress]}
                    routePointIndex={0}
                    routePointsType={routePointType.first}
                    isRouteToOffice={true}
                    return={(address) => { this.updateHomeAddress(address) }}
                  />
                  : <RouteMap
                    routePoints={this.state.routePoints}
                    routePointIndex={this.state.currentRoutePoint.index}
                    routePointsType={this.state.currentRoutePoint.routePointType}
                    isRouteToOffice={true}
                    return={(address) => { this.selectLocation(address) }}
                  />
              }


            </div>
        }
        <SnackBars
          message={this.state.snackBarMessage}
          snackBarClicked={this.state.snackBarClicked}
          variant={this.state.snackBarVariant}
        />
      </div>

    );
  }
}

export default DriverMap;
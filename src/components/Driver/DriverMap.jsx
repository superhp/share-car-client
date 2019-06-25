import * as React from "react";
import Map from "ol/Map";
import View from "ol/View";
import SourceVector from "ol/source/Vector";
import LayerVector from "ol/layer/Vector";
import Tile from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Button from "@material-ui/core/Button";
import { OfficeAddresses } from "../../utils/AddressData";
import RideScheduler from "./Ride/RideScheduler";
import { DriverRouteInput } from "./Map/DriverRouteInput";
import LocationSelection from "../Maps/LocationSelection";
import {
  fromLonLatToMapCoords, fromMapCoordsToLonLat,
  getNearest, coordinatesToLocation,
  createPointFeature, createRouteFeature,
  createRoute, iconType
} from "./../../utils/mapUtils";
import { addressToString, fromLocationIqResponse } from "../../utils/addressUtils";
import "./../../styles/testmap.css";
import RouteSelection from "../Maps/RouteSelection";
import LocationSelectionMap from "../Maps/LocationSelectionMap";
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
  }

  state = {
    isRideSchedulerVisible: false,
    direction: true,
    routeGeometry: null, // only needed to prevent duplicate calls for RideScheduler
    routePoints: [{
      address: null,
      displayName: null,
      routePointType: routePointType.first
    },
    {
      address: null,
      displayName: null,
      routePointType: routePointType.last
    }],
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

  // index => index of input field representing route point. Since First Route Point is office (and there is no input field for office) index must be incermented
  changeRoutePoint(address, index) {
    if (address) {
      const { longitude, latitude } = address
      let routePoints = [...this.state.routePoints];
      routePoints[index] = {
        address: address,
        displayName: addressToString(address),
        routePointType: this.state.currentRoutePoint.routePointType
      }
      this.setState({ routePoints: routePoints }, () => this.updateMap());
    }
  }
  addNewRoutePoint(address, index) {
    index++;
    const { longitude, latitude } = address;
    let points = [...this.state.routePoints];
    points.splice(index, 0, {
      address: address,
      displayName: addressToString(address),
      routePointType: this.state.currentRoutePoint.routePointType
    });

    this.setState({ routePoints: points }, () => this.updateMap());
  }

  updateMap() {
    const { routePoints } = this.state;
    const points = routePoints.filter(x => x.address).map(x => x.address);
    this.vectorSource.clear();
    for (let i = 0; i < routePoints.length; i++) {
      if (routePoints[i].address) {
        const { longitude, latitude } = routePoints[i].address;
        let feature;
        if(i === 0){
        feature = createPointFeature(longitude, latitude, iconType.start);
        }else{
          if(i === routePoints.length - 1){
            feature = createPointFeature(longitude, latitude, iconType.finish);
          } else{
            feature = createPointFeature(longitude, latitude, iconType.point);
          }
        }
        this.vectorSource.addFeature(feature);
      }
    }
    if (points.length > 1) {
      createRoute(points, this.state.direction)
        .then(geometry => {
          const routeFeature = createRouteFeature(geometry);
          this.vectorSource.addFeature(routeFeature);
          this.setState({ routeGeometry: geometry });
        });
    }
  }

  // index => index of input field representing route point. Since First Route Point is office (and there is no input field for office) index must be incermented
  removeRoutePoint(index) {
    let routePoints = [...this.state.routePoints];
    let shouldRerender = routePoints[index].displayName !== null;
    routePoints.splice(index, 1);
    this.setState({ routePoints: routePoints }, () => {
      if (shouldRerender) {
        this.updateMap()
      }
    });
  }

  changeDirection() {
    let routePoints = [...this.state.routePoints];
    let revertedPoints = [];
    for (let i = routePoints.length - 1; i >= 0; i--) {
      if (routePoints[i].routePointType === routePointType.last) {
        routePoints[i].routePointType = routePointType.first
      }
      if (routePoints[i].routePointType === routePointType.first) {
        routePoints[i].routePointType = routePointType.last
      }
      revertedPoints.push(routePoints[i]);
    }
    this.setState({ routePoints: revertedPoints, direction: !this.state.direction }, () => this.updateMap());
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

    setTimeout(() => { this.map.updateSize(); }, 200);

    return { map, vectorSource };
  }

  updateHomeAddress(address) {
    if (address) {
      api.post(`User/updateHomeAddress`, address).then(response => {
        let stateAddress = {
          address: address,
          displayName: addressToString(address)
        }
        this.setState({ currentComponent: currentComponent.locationSelection, homeAddress: stateAddress, homeAddressSelection: false });
      }).catch(() => {
        showSnackBar("Failed to set home address", 2, this);
      });
    }
    this.setState({ currentComponent: currentComponent.locationSelection, homeAddressSelection: false });
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
      let points = [...routePoints];
      points.splice(points.length - 1, 0, {
        address: null,
        displayName: null,
        routePointType: routePointType.intermediate
      });
      this.setState({ routePoints: points });
    }
  }

  shouldShowError() {
    const { routePoints } = this.state;

    for (let i = 0; i < routePoints.length; i += routePoints.length - 1) {
      if (!routePoints[i].displayName) {
        return false;
      } else if (OfficeAddresses.filter(x =>
        x.longitude === routePoints[i].address.longitude &&
        x.latitude === routePoints[i].address.latitude).length > 0) {
        return false;
      }
    }
    return true;
  }

  canCreateRide() {
    const { routePoints } = this.state;
    if (routePoints[0].displayName && routePoints[routePoints.length - 1].displayName && !this.shouldShowError()) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div>
        {
          this.state.currentComponent === currentComponent.FullMap
            ? <div>
              <div className="routes">
                <RouteSelection
                  driver={true}
                  officeSelectionChange={(address, inputIndex, officeIndex) => this.officeSelectionChange(address, inputIndex, officeIndex)}
                  changeDirection={() => this.changeDirection()}
                  routePoints={this.state.routePoints}
                  removeRoutePoint={index => this.removeRoutePoint(index)}
                  addNewRoutePoint={() => this.addEmptyRoutePoint()}
                  direction={this.state.direction}
                  showLocationSelection={(routePointIndex, routePointType) => { this.showLocationSelection(routePointIndex, routePointType) }}
                />


              </div>
              <div id="map"></div>

              {this.state.isRideSchedulerVisible ? (
                <RideScheduler routeInfo={{
                  fromAddress: this.state.routePoints[0].address,
                  toAddress: this.state.routePoints[this.state.routePoints.length - 1].address,
                  routeGeometry: this.state.routeGeometry
                }} />
              ) : null}

              <Button
                disabled={!this.canCreateRide()}
                className="continue-button"
                variant="contained"
                onClick={() => this.setState({ isRideSchedulerVisible: !this.state.isRideSchedulerVisible })}
              >
                Continue
        </Button>


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
                  ? <LocationSelectionMap
                    driver={true}
                    routePoints={[this.state.homeAddress]}
                    routePointIndex={0}
                    routePointsType={routePointType.first}
                    direction={this.state.direction}
                    return={(address) => { this.updateHomeAddress(address) }}
                  />
                  : <LocationSelectionMap
                    driver={true}
                    routePoints={this.state.routePoints}
                    routePointIndex={this.state.currentRoutePoint.index}
                    routePointsType={this.state.currentRoutePoint.routePointType}
                    direction={this.state.direction}
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
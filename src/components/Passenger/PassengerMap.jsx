import * as React from "react";
import Map from "ol/Map";
import View from "ol/View";
import SourceVector from "ol/source/Vector";
import LayerVector from "ol/layer/Vector";
import Tile from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Grid from "@material-ui/core/Grid";
import { centerMap } from "./../../utils/mapUtils";
import { PassengerRouteSelection } from "./Route/PassengerRouteSelection";
import { PassengerNavigationButton } from "./PassengerNavigationButton";
import api from "./../../helpers/axiosHelper";
import {
  fromLonLatToMapCoords, fromMapCoordsToLonLat,
  getNearest, coordinatesToLocation, createPointFeature,
  createRouteFeature, iconType
} from "../../utils/mapUtils";
import { fromLocationIqResponse, addressToString } from "../../utils/addressUtils";
import { sortRoutes } from "../../utils/shortestDistance";
import { OfficeAddresses } from "../../utils/AddressData";
import "./../../styles/genericStyles.css";
import "../../styles/testmap.css";
import SnackBars from "../common/Snackbars";
import DriverRoutesSugestionsModal from "./Route/DriverRideSugestionsModal";
import Media from "react-media";
import NavigateNext from "@material-ui/icons/NavigateNext";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";
import { SnackbarVariants, showSnackBar } from "../../utils/SnackBarUtils";
import RouteSelection from "../Maps/RouteSelection";
import LocationSelectionMap from "../Maps/LocationSelectionMap";
import { routePointType } from "../../utils/routePointTypes";
import LocationSelection from "../Maps/LocationSelection";
import { DriverRoutesSuggestions } from "./Route/DriverRoutesSuggestions";
const currentComponent = {
  fullMap: 0,
  locationSelection: 1,
  addPointMap: 2,
}
export class PassengerMap extends React.Component {

  state = {
    passengerAddress: null,
    direction: true,
    routes: [],
    currentRoute: { routeFeature: null, fromFeature: null, toFeature: null },
    currentRouteIndex: -1,
    currentRides: [],
    note: "",
    snackBarMessage: "",
    snackBarClicked: false,
    snackBarVariant: null,
    showFilters: true,
    showDrivers: false,
    selectedDriver: null,
    loading: true,
    driverInput: null,
    currentComponent: currentComponent.FullMap,
    homeAddress: null,
    routePoints: [{
      address: null,
      displayName: null,
      routePointType: iconType.first
    },
    {
      address: null,
      displayName: null,
      routePointType: iconType.last
    }],
    currentRoutePoint: { index: 0, routePointType: iconType.first, displayName: null },
  }

  componentDidMount() {
    const { map, vectorSource } = this.initializeMap();
    this.map = map;
    this.vectorSource = vectorSource;
    api.get(`User/homeAddress`).then(response => {

      if (response.data !== "") {
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

      this.changeRoutePoint(address, currentRoutePoint.index);
    });
  }

  createPointFeature(address, iconType) {
    const { longitude, latitude } = address;
    const feature = createPointFeature(longitude, latitude, iconType);
    this.vectorSource.addFeature(feature);
  }

  updateMap() {
    const { routePoints, routes, currentRouteIndex } = this.state;
    const points = routePoints.filter(x => x.address).map(x => x.address);
    this.vectorSource.clear();

    if (routePoints[0].address) {
      this.createPointFeature(routePoints[0].address, iconType.start);
    }

    if (routePoints[1].address) {
      this.createPointFeature(routePoints[1].address, iconType.finish);
    }

    if (routes.length > 0 && currentRouteIndex >= 0) {
      const routeFeature = createRouteFeature(routes[currentRouteIndex].geometry);
      this.createPointFeature(routes[currentRouteIndex].fromAddress, iconType.start);
      this.createPointFeature(routes[currentRouteIndex].toAddress, iconType.finish);
      this.vectorSource.addFeature(routeFeature);
    }
  }

  showRoute(index) {
    this.setState({ currentRouteIndex: index }, () => this.updateMap());
  }

  getPassengerAddress() {
    const { routePoints } = this.state;
    if (routePoints[0].address && routePoints[1].address) {

      if (OfficeAddresses.filter(x =>
        x.longitude === routePoints[0].address.longitude &&
        x.latitude === routePoints[0].address.latitude).length > 0 &&

        OfficeAddresses.filter(x =>
          x.longitude === routePoints[1].address.longitude &&
          x.latitude === routePoints[1].address.latitude).length > 0) {
        return routePoints[0].address;
      }

      if (OfficeAddresses.filter(x =>
        x.longitude === routePoints[0].address.longitude &&
        x.latitude === routePoints[0].address.latitude).length > 0) {
        return routePoints[1].address;
      }

      if (OfficeAddresses.filter(x =>
        x.longitude === routePoints[1].address.longitude &&
        x.latitude === routePoints[1].address.latitude).length > 0) {
        return routePoints[0].address;
      }
    }
    return null;
  }

  changeRoutePoint(address, index) {
    const { longitude, latitude } = address
    let routePoints = [...this.state.routePoints];
    const feature = createPointFeature(longitude, latitude, index === 0 ? iconType.start : iconType.finish);
    this.vectorSource.addFeature(feature);
    routePoints[index] = {
      address: address,
      displayName: addressToString(address),
      routePointType: this.state.currentRoutePoint.routePointType
    }

    this.setState({ routePoints }, () => {
      let passengerAddress = this.getPassengerAddress();
      this.setState({ passengerAddress }, () => {
        if (this.isAddressOffice(address)) {
          this.getRoutes();
        }

        let routeDto = {
          FromAddress: null,
          ToAddress: null
        };

        if (routePoints[0].address && this.isAddressOffice(routePoints[0].address)) {
          routeDto.FromAddress = routePoints[0].address;
        }
        if (routePoints[1].address && this.isAddressOffice(routePoints[1].address)) {
          routeDto.ToAddress = routePoints[1].address;
        }
          this.sortRoutes(this.state.routes);
        this.updateMap();
      });
    });
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

  changeDirection() {
    let routePoints = [...this.state.routePoints];
    let revertedPoints = [];
    for (let i = routePoints.length - 1; i >= 0; i--) {
      if (routePoints[i].routePointType === iconType.last) {
        routePoints[i].routePointType = iconType.first
      }
      if (routePoints[i].routePointType === iconType.first) {
        routePoints[i].routePointType = iconType.last
      }
      revertedPoints.push(routePoints[i]);
    }
    this.setState({ routePoints: revertedPoints, direction: !this.state.direction }, () => {
      let passengerAddress = this.getPassengerAddress();
      this.setState({ passengerAddress }, () => {
        this.getRoutes();
        this.updateMap()
      });
    });
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

  shouldSuggestDrivers() {
    const { routePoints } = this.state;
    if (routePoints[0].displayName && routePoints[1].displayName && !this.shouldShowError()) {
      return true;
    }
    return false;
  }

  isAddressOffice(address) {
    return OfficeAddresses.filter(x => x.longitude === address.longitude &&
      x.latitude === address.latitude).length !== 0;
  }

  getRoutes() {
    let routeDto = {
      FromAddress: null,
      ToAddress: null
    };
    this.setState({ loading: true });
    const { routePoints } = this.state;
    if (routePoints[0].address && this.isAddressOffice(routePoints[0].address)) {
      routeDto.FromAddress = routePoints[0].address;
    }
    if (routePoints[1].address && this.isAddressOffice(routePoints[1].address)) {
      routeDto.ToAddress = routePoints[1].address;
    }

    api.post("Ride/routes", routeDto).then(response => {
      if (response.data.length === 0 && !this.shouldShowError()) {
        showSnackBar("No drivers to suggest", 2, this)
      }
      let sortedRoutes = this.sortRoutes(response.data);
      this.setState({ loading: false, routes: sortedRoutes, currentRoute: { routeFeature: null, fromFeature: null, toFeature: null } }, this.displayRoute);
    }).catch((error) => {
      this.setState({ loading: false });
      showSnackBar("Failed to load routes", 2, this)
    });
  }

  sortRoutes(routes) {
    let sortedRoutes = [];
    const { routePoints } = this.state;

    if (routePoints[0].address && routePoints[1].address) {
      if (routePoints[0].address && this.isAddressOffice(routePoints[0].address) && routePoints[1].address && this.isAddressOffice(routePoints[1].address)) {
        sortedRoutes = sortRoutes(routePoints[0].address, routes);
      } else if (routePoints[0].address && this.isAddressOffice(routePoints[0].address)) {
        sortedRoutes = sortRoutes(routePoints[1].address, routes);
      } else if (routePoints[1].address && this.isAddressOffice(routePoints[1].address)) {
        sortedRoutes = sortRoutes(routePoints[0].address, routes);
      }
      return sortedRoutes;
    }
    return routes;
  }
  render() {
    return (
      <div>
        {
          this.state.currentComponent === currentComponent.FullMap
            ? <div>
              <div className="routes">
                <RouteSelection
                  driver={false}
                  officeSelectionChange={(address, inputIndex, officeIndex) => this.officeSelectionChange(address, inputIndex, officeIndex)}
                  changeDirection={() => this.changeDirection()}
                  routePoints={this.state.routePoints}
                  removeRoutePoint={index => this.removeRoutePoint(index)}
                  addNewRoutePoint={() => this.addEmptyRoutePoint()}
                  direction={this.state.direction}
                  showLocationSelection={(routePointIndex, routePointType) => { this.showLocationSelection(routePointIndex, routePointType) }}
                />
              </div>
              {
                this.state.routePoints[0].address &&
                  this.state.routePoints[1].address &&
                  this.state.routes.length > 0 &&
                  !this.shouldShowError()
                  ? <div className="view-drivers">
                    <DriverRoutesSuggestions
                      routes={this.state.routes}
                      showRoute={(index) => { this.showRoute(index) }}
                      showRides={(index) => { this.getRidesByRoute(index) }}
                      passengerAddress={this.state.passengerAddress}
                      showSnackBar={(message, variant) => showSnackBar(message, variant, this)}
                    />
                  </div>
                  : null
              }
              <div id="map"></div>
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
                    driver={false}
                    routePoints={[]}
                    routePointIndex={0}
                    routePointsType={iconType.first}
                    direction={this.state.direction}
                    return={(address) => { this.updateHomeAddress(address) }}
                  />
                  : <LocationSelectionMap
                    driver={false}
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
export default PassengerMap;
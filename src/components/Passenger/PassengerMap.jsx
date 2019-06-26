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
import ViewDrivers from "./ViewDrivers";
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
    fetchedRoutes: [],
    routes: [],
    users: [],
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

      if (currentRoutePoint.routePointType === iconType.first) {
        if (routePoints.length > 0 && routePoints[0].routePointType === iconType.first) {
          this.changeRoutePoint(address, currentRoutePoint.index);
        } else {
          this.addNewRoutePoint(address, currentRoutePoint.index);
        }
      } else {
        if (routePoints.length > 0 && routePoints[routePoints.length - 1].routePointType === iconType.last) {
          this.changeRoutePoint(address, currentRoutePoint.index);
        } else {
          this.addNewRoutePoint(address, currentRoutePoint.index);
        }
      }
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
    if (address) {
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
          this.updateMap();
        });
      });
    }
  }

  /*
    getUsers() {
      api.get("user/getDrivers")
        .then((response) => {
          this.setState({ users: response.data });
        })
        .catch((err) => {
          showSnackBar("Something went wrong.", 2, this)
        });
    }
  
    onDriverSelection(email) {
  
      let routes = [...this.state.fetchedRoutes];
      routes = routes.filter(x => x.drivers.includes(email));
      if (routes.length === 0) {
        if(this.state.selectedDriver){
        showSnackBar("Selected driver doesn't have rides", 2, this);
        }else{
          showSnackBar("Choose an existing driver", 2, this);
        }
      }
      this.setState({ selectedDriver: email, routes, currentRouteIndex: 0 }, this.displayRoute);
    }
  
    onAutosuggestBlur(resetRoutes) {
      if (resetRoutes) {
        this.setState({ routes: this.state.fetchedRoutes, currentRouteIndex: 0 }, this.displayRoute);
      } else {
        this.setState({ routes: [], currentRouteIndex: 0 }, this.displayRoute);
      }
    }
  */
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
  /*
    displayRoute() {
      this.vectorSource.clear();
      if (this.state.pickUpPointFeature) {
        this.vectorSource.addFeature(this.state.pickUpPointFeature);
      }
      if (this.state.routes.length > 0) {
        const route = this.state.routes[this.state.currentRouteIndex];
  
        const routeFeature = createRouteFeature(route.geometry);
        const fromFeature = createPointFeature(route.fromAddress.longitude, route.fromAddress.latitude);
        const toFeature = createPointFeature(route.toAddress.longitude, route.toAddress.latitude);
  
        this.setState({ currentRoute: { ...this.state.currentRoute, routeFeature: routeFeature, fromFeature: fromFeature, toFeature: toFeature } });
        this.vectorSource.addFeature(routeFeature);
        this.vectorSource.addFeature(fromFeature);
        this.vectorSource.addFeature(toFeature);
      }
    }
  */


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


  /*
    handleMapClick(longitude, latitude) {
      getNearest(longitude, latitude)
        .then(([long, lat]) => coordinatesToLocation(lat, long))
        .then(response => {
          const address = fromLocationIqResponse(response);
          address.longitude = longitude;
          address.latitude = latitude;
          var sortedRoutes = sortRoutes(address, this.state.routes);
          this.setState({ routes: sortedRoutes, passengerAddress: address, currentRouteIndex: 0 }, this.setPickUpPointFeature)
        }).catch();
    }
  
    onMeetupAddressChange(newAddress) {
      if (newAddress) {
        var address = addressToString(newAddress);
        if (address) {
          this.setState({ passengerAddress: newAddress }, this.setPickUpPointFeature);
          if (newAddress) {
            centerMap(newAddress.longitude, newAddress.latitude, this.map);
          }
        }
      }
    }
  
    handleNoteUpdate(note) {
      this.setState({ note });
    }
  
    showRoutesDrivers() {
      this.getRidesByRoute();
      this.setState({ showDrivers: true });
    }
  */

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
      let sortedRoutes = this.sortRoutes(routeDto, response.data);
      this.setState({ loading: false, routes: sortedRoutes, currentRoute: { routeFeature: null, fromFeature: null, toFeature: null } }, this.displayRoute);
    }).catch((error) => {
      this.setState({ loading: false });
      showSnackBar("Failed to load routes", 2, this)
    });

  }

  sortRoutes(routeDto, routes) {
    let sortedRoutes = [];
    const { routePoints } = this.state;

    if (routePoints[0].address && routePoints[1].address) {
      if (routePoints[0].address && this.isAddressOffice(routePoints[0].address) && routePoints[1].address && this.isAddressOffice(routePoints[1].address)) {
        sortedRoutes = sortRoutes(routeDto.FromAddress, routes);
      } else if (routePoints[0].address && this.isAddressOffice(routePoints[0].address)) {
        sortedRoutes = sortRoutes(routeDto.ToAddress, routes);
      } else if (routePoints[1].address && this.isAddressOffice(routePoints[1].address)) {
        sortedRoutes = sortRoutes(routeDto.FromAddress, routes);
      }
    }
    return sortedRoutes;
  }

  /*
    handleRegister(ride) {
      if (!this.state.passengerAddress) {
        showSnackBar(this.state.direction === "from" ? "Choose your destination point" : "Choose your pick up point", 2, this)
      }
      else {
        const request = {
          RideId: ride.rideId,
          DriverEmail: ride.driverEmail,
          RequestNote: this.state.note,
          Address: {
            Longitude: this.state.passengerAddress.longitude,
            Latitude: this.state.passengerAddress.latitude
          }
        };
  
  
  
        api.post(`RideRequest`, request).then(response => {
          let rides = [...this.state.currentRides];
          let index = rides.indexOf(ride);
          rides[index].requested = true;
  
          this.setState({ currentRides: rides });
          showSnackBar("Ride requested!", 0, this)
  
        })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              showSnackBar(error.response.data, 2, this)
            } else {
              showSnackBar("Failed to request ride", 2, this)
            }
          });
      }
    }*/
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
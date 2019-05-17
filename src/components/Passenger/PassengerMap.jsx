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
  createRouteFeature
} from "../../utils/mapUtils";
import { fromLocationIqResponse, addressToString } from "../../utils/addressUtils";
import { sortRoutes } from "../../utils/shortestDistance";
import { OfficeAddresses } from "../../utils/AddressData";
import "./../../styles/genericStyles.css";
import "../../styles/testmap.css";
import SnackBars from "../common/Snackbars";
import { SnackbarVariants } from "../common/SnackbarVariants";
import DriverRoutesSugestionsModal from "./Route/DriverRoutesSugestionsModal";
import Media from "react-media";
import NavigateNext from "@material-ui/icons/NavigateNext";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import Button from "@material-ui/core/Button";


export class PassengerMap extends React.Component {
  state = {
    passengerAddress: null,
    direction: "from",
    fetchedRoutes: [],
    routes: [],
    users: [],
    pickUpPointFeature: null,
    currentRoute: { routeFeature: null, fromFeature: null, toFeature: null },
    currentRouteIndex: 0,
    currentRides: [],
    note:"",
    showDriver: false,
    snackBarMessage: "",
    snackBarClicked: false,
    snackBarVariant: null,
  }

  componentDidMount() {
    const { map, vectorSource } = this.initializeMap();
    this.map = map;
    this.vectorSource = vectorSource;
    this.getAllRoutes(OfficeAddresses[0], this.state.direction);
    this.getUsers();
  }

  componentWillReceiveProps(nextProps) {
    this.vectorSource.clear();
    this.setState({
      passengerAddress: null,
      direction: "from",
      routes: [],
      users: [],
      pickUpPointFeature: null,
      currentRoute: { routeFeature: null, fromFeature: null, toFeature: null },
      currentRouteIndex: 0,
      currentRides: [],
      showDriver: false,
      snackBarMessage: "",
      snackBarClick: false,
      snackBarVariant: null,
    });
    this.getAllRoutes(OfficeAddresses[0], this.state.direction);
    this.getUsers();
  }

  getUsers() {
    api.get("user/getDrivers")
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((err) => {
        this.showSnackBar("Something went wrong.", 2)
      });
  }

  onDriverSelection(email) {
    let routes = [...this.state.fetchedRoutes];
    routes = routes.filter(x => x.rides.filter(y => y.driverEmail === email).length > 0)
    this.setState({ routes, currentRouteIndex: 0 }, this.displayRoute);
  }

  onAutosuggestBlur(resetRoutes) {
    if(resetRoutes){
    this.setState({ routes: this.state.fetchedRoutes, currentRouteIndex: 0 }, this.displayRoute);
  }else{
    this.setState({ routes: [], currentRouteIndex: 0 }, this.displayRoute);
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

  displayRoute() {
    this.setState({ showDriver: true });
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

  changePickUpPoint() {
    if (this.state.pickUpPointFeature) {
      this.vectorSource.removeFeature(this.state.pickUpPointFeature);
    }
    const { passengerAddress } = this.state;
    if (passengerAddress) {
      const { longitude, latitude } = passengerAddress;
      let feature = createPointFeature(longitude, latitude);
      this.setState({ pickUpPointFeature: feature })
      this.vectorSource.addFeature(feature);
    }
  }

  handleMapClick(longitude, latitude) {
    getNearest(longitude, latitude)
      .then(([long, lat]) => coordinatesToLocation(lat, long))
      .then(response => {
        const address = fromLocationIqResponse(response);
        address.longitude = longitude;
        address.latitude = latitude;
        sortRoutes(address, this.state.routes);
        this.displayRoute();
        this.setState({ passengerAddress: address, currentRouteIndex: 0 }, this.changePickUpPoint);
      }).catch();
      }

  onMeetupAddressChange(newAddress) {
    if (newAddress) {
      var address = addressToString(newAddress);
      if (address) {
        this.setState({ passengerAddress: newAddress }, this.changePickUpPoint);
        if (newAddress) {
          centerMap(newAddress.longitude, newAddress.latitude, this.map);
        }
      }
    }
  }

  handleNoteUpdate(note) {
this.setState({note});
  }

getRideByRoute(){
    api.get("Ride/RidesByRoute/" +  this.state.routes[this.state.currentRouteIndex].routeId).then(res => {
      if (res.status === 200 && res.data !== "") {
        this.setState({ currentRides: res.data});
      }
    }).catch((error) => {
      this.showSnackBar("Failed to load rides", 2)
    });
  
}

  getAllRoutes(address, direction) {
    if (address) {
      let routeDto;
      this.setState({ direction: direction });
      if (direction === "to")
        routeDto = { ToAddress: address };
      else
        routeDto = { FromAddress: address };
      api.post("Ride/routes", routeDto).then(res => {
        if (res.status === 200 && res.data !== "") {
          this.setState({ routes: res.data, fetchedRoutes: res.data, currentRoute: { routeFeature: null, fromFeature: null, toFeature: null } }, this.displayRoute);
        }
      }).catch((error) => {
        this.showSnackBar("Failed to load routes", 2)
      });
    }
  }

  handleRegister(ride) {
    if (!this.state.passengerAddress) {
      this.showSnackBar("Choose your pick up point", 2)
    }
    else {
      const request = {
        RideId: ride.rideId,
        DriverEmail: ride.driverEmail,
        RequestNote:this.state.note,
        Address: {
          Longitude: this.state.passengerAddress.longitude,
          Latitude: this.state.passengerAddress.latitude
        }
      };



      api.post(`RideRequest`, request).then(response => {
        let rides = [...this.state.currentRides];
let index = rides.indexOf(ride);
rides[index].requested = true;

this.setState({currentRides:rides});
        this.showSnackBar("Ride requested!", 0)

      })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            this.showSnackBar(error.response.data, 2)
          } else {
            this.showSnackBar("Failed to request ride", 2)
          }
        });
    }
  }

  showSnackBar(message, variant) {
    this.setState({
      snackBarClicked: true,
      snackBarMessage: message,
      snackBarVariant: SnackbarVariants[variant]
    });
    setTimeout(
      function () {
        this.setState({ snackBarClicked: false });
      }.bind(this),
      3000
    );
  }

  render() {
    return (
      <div>
        <div id="map"></div>
        <div className="passengerForm">
          <PassengerRouteSelection
            direction={this.state.direction}
            initialAddress={OfficeAddresses[0]}
            users={this.state.users}
            onDriverSelection={(email) => { this.onDriverSelection(email) }}
            onAutosuggestBlur={(resetRoutes) => { this.onAutosuggestBlur(resetRoutes) }}
            displayName={addressToString(this.state.passengerAddress)}
            onChange={(address, direction) => this.getAllRoutes(address, direction)}
            onMeetupAddressChange={address => this.onMeetupAddressChange(address)}
          />
          {this.state.showDriver && this.state.routes.length > 0 ? (
            <DriverRoutesSugestionsModal
              rides={this.state.currentRides}
              onRegister={ride => this.handleRegister(ride)}
              handleNoteUpdate={(note) => { this.handleNoteUpdate(note) }}
              showDrivers = {this.getRideByRoute.bind(this)}
            />
          ) : (
              <div></div>
            )}
        </div>
        {this.state.routes.length > 1
          ? <Grid className="navigation-buttons">
            <Media query="(min-width: 714px)">
              {matches => matches ?
                <div>
                  <PassengerNavigationButton
                    onClick={() => this.setState({
                      currentRouteIndex: (this.state.currentRouteIndex - 1 + this.state.routes.length) % this.state.routes.length
                    },
                      this.displayRoute
                    )}
                    text="View Previous Route"
                  />
                  <PassengerNavigationButton
                    onClick={() => this.setState({
                      currentRouteIndex: (this.state.currentRouteIndex + 1) % this.state.routes.length
                    },
                      this.displayRoute
                    )}
                    text="View Next Route"
                  />
                </div>
                : <div>
                  <Button
                    variant="contained"
                    className="next-button"
                    onClick={() => this.setState({
                      currentRouteIndex: (this.state.currentRouteIndex - 1 + this.state.routes.length) % this.state.routes.length
                    },
                      this.displayRoute
                    )}
                  >
                    <NavigateBefore fontSize="large" />
                  </Button>
                  <Button
                    variant="contained"
                    className="next-button"
                    onClick={() => this.setState({
                      currentRouteIndex: (this.state.currentRouteIndex + 1) % this.state.routes.length
                    },
                      this.displayRoute
                    )}
                  >
                    <NavigateNext fontSize="large" />
                  </Button>
                </div>}
            </Media>
          </Grid>
          : <div />
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
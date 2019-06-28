import * as React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import DeleteIcon from "@material-ui/icons/Delete";
import Close from "@material-ui/icons/Close";
import InfoIcon from "@material-ui/icons/Info";
import "typeface-roboto";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import "../../../styles/driversRidesList.css";
import "../../../styles/genericStyles.css";
import "../../../styles/navbar.css";
import { PendingRequests } from "./PendingRequests";
import { Checkbox } from "@material-ui/core";
import { RideDeletingConfirmation } from "./RideDeletingConfirmation";
import api from "../../../helpers/axiosHelper"
import { CircularProgress } from "@material-ui/core";
import { SnackbarVariants, showSnackBar } from "../../../utils/SnackBarUtils"
import SnackBars from "../../common/Snackbars";

let moment = require("moment");

export class DriversRidesList extends React.Component {

  state = {
    openRideInfo: false,
    openDeleteConfirmation: false,
    tabValue: 0,
    rides: [],
    selectedRides: [],
    rideToDelete: null,
    fetchedRides: [],
    requests: [],
    passengers: [],
    selectedRide: null,
    snackBarClicked: false,
    snackBarMessage: null,
    snackBarVariant: null,
    loading: true
  }

  componentDidMount() {
    this.getDriversRides();
  }

  getDriversRides() {
    this.setState({ loading: true })
    api.get("Ride")
      .then(response => {
        if (response.status === 200) {
          let fetchedRides = response.data;
          let requests = [];
          let passengers = [];
          for (var i = 0; i < fetchedRides.length; i++) {
            if (fetchedRides[i].requests.length > 0) {
              requests = requests.concat(fetchedRides[i].requests);
              fetchedRides[i].requests = null;
            }
            if (fetchedRides[i].passengers.length > 0) {
              passengers = passengers.concat(fetchedRides[i].passengers);
              fetchedRides[i].passengers = null;
            }
          }
          this.setState({ fetchedRides, requests, passengers, rides: fetchedRides.filter(x => !x.finished), loading: false });

        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        this.showSnackBar("Failed to load rides", 2, this)
      });
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ clickedRequest: false });
  };

  sendRequestResponse(response, rideRequestId, rideId, driverEmail) {
    let data = {
      RideRequestId: rideRequestId,
      Status: response,
      RideId: rideId,
      DriverEmail: driverEmail
    };
    api.put("/RideRequest", data).then(res => {
      if (res.status === 200) {
        if (response === 1) {
          var request = this.state.requests.find(x => x.rideRequestId === rideRequestId);
          this.setState({
            passengers: [...this.state.passengers, {
              firstName: request.passengerFirstName,
              lastName: request.passengerLastName,
              phone: request.passengerPhone,
              longitude: request.address.longitude,
              latitude: request.address.latitude,
              route: request.route,
              rideId: request.rideId,
            }],

          });
          this.showSnackBar("Request accepted", 0, this)

        } else {
          this.showSnackBar("Request denied", 0, this)
        }
        this.setState({
          clickedRequest: true,
          requests: this.state.requests.filter(
            x => x.rideRequestId !== rideRequestId
          ),
        });
      }
    }).catch((error) => {
      if (error.response && error.response.status === 409) {
        this.showSnackBar(error.response.data, 2, this)
      }
      else {
        this.showSnackBar("Failed to respond to request", 2, this)
      }
    });
  }

  deleteRides() {
    const { selectedRides, rideToDelete } = this.state;
    let rides = this.state.selectedRides;
    if (!rides.includes(rideToDelete)) {
      rides.push(rideToDelete);
    }
    api.put("Ride/disactivate", rides).then(response => {
      let newRides = this.state.rides.filter(x => !rides.includes(x));
      this.setState({ selectedRides: [], rides: newRides, rideToDelete: null, openDeleteConfirmation: false }, () => {
        this.deselectAll();
        this.showSnackBar("Rides deleted successfully", 0, this);
      });
    }).catch(error => {
      this.setState({ openDeleteConfirmation: false });
      this.showSnackBar("Failed to delete rides", 2, this);
    });
  }

  handleChange(newValue) {
    let rides = [];
    const { fetchedRides } = this.state;
    if (newValue === 0) {
      rides = fetchedRides.filter(x => !x.finished);
    } else {
      rides = fetchedRides.filter(x => x.finished);
    }
    this.setState({ tabValue: newValue, rides });
  }

  handleRideSelection(e, ride) {
    let selectedRides = [...this.state.selectedRides];

    if (e.target.checked) {
      selectedRides.push(ride);
    } else {
      const index = selectedRides.indexOf(ride);
      selectedRides.splice(index, 1);
    }
    this.setState({ selectedRides });
  }

  selectAll() {
    this.setState({ selectedRides: this.state.rides });
    let checkboxes = document.getElementsByClassName("select-ride");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = true;
    }
  }

  deselectAll() {
    this.setState({ selectedRides: [] });
    let checkboxes = document.getElementsByClassName("select-ride");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  }

  shouldDeleteMultipleRides() {
    const { selectedRides, rideToDelete } = this.state;
    if (selectedRides.includes(rideToDelete)) {
      if (selectedRides.length > 1) {
        return true;
      } else {
        return false;
      }
    } else {
      if (selectedRides.length > 0) {
        return true;
      }
    }
    return false;
  }

  render() {
    return (
      <div>
        {this.state.loading ?
          <div className="progress-circle">
            <CircularProgress />
          </div>
          : <Grid container>
            <AppBar className="nav-tabs-container" position="static">
              <Tabs centered value={this.state.tabValue} onChange={((e, newValue) => this.handleChange(newValue))}>
                <Tab className="nav-tabs" label="Active" />
                <Tab className="nav-tabs" label="Obsolete" />
              </Tabs>
            </AppBar>
            <RideDeletingConfirmation
              open={this.state.openDeleteConfirmation}
              confirm={() => this.deleteRides()}
              deny={() => this.setState({ openDeleteConfirmation: false })}
              deleteMultipleRides={this.shouldDeleteMultipleRides()}
            />
            {
              this.state.selectedRides.length > 0
                ? <Card className="generic-card">
                  <div className="select-rides-container">
                    <Button
                      onClick={() => this.selectAll()}
                      variant="contained"
                      size="small"
                      className="generic-colored-btn"
                    >
                      Select all
                  </Button>
                    <Button
                      onClick={() => this.deselectAll()}

                      variant="contained"
                      size="small"
                      className="generic-colored-btn"
                    >
                      Deselect all
                  </Button>
                  </div>
                </Card>
                : <div></div>
            }
            {this.state.rides.length > 0 ? this.state.rides.map((ride, index) => (
              <Grid key={index} item xs={12}>
                <Card className="generic-card">

                  <Grid container className="active-rides-card-container">

                    <Grid item xs={8}>
                      {this.state.requests.filter(x => x.rideId === ride.rideId && (!x.seenByDriver || !x.requestNoteSeen)).length > 0
                        ? <Badge
                          className="rides-badge"
                          badgeContent={"new"}
                          color="primary"
                          children={""}
                        ></Badge>
                        : null
                      }
                      <CardContent >
                        <Typography className="generic-color" component="p">
                          From {ride.route.fromAddress.street} {ride.route.fromAddress.number}, {ride.route.fromAddress.city}
                        </Typography>
                        <Typography color="textSecondary">
                          To {ride.route.toAddress.street} {ride.route.toAddress.number}, {ride.route.toAddress.city}
                        </Typography>
                        <Typography color="textSecondary">
                          {moment(ride.rideDateTime).format("dddd MMM DD YYYY hh:mm")}
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid item xs={3} className="list-buttons">
                      <Button
                        onClick={() => {
                          this.setState({ selectedRide: ride });
                          this.setState({ openRideInfo: true });
                        }}
                        variant="contained"
                        size="small"
                        className="generic-colored-btn"
                      >
                        View
                          <InfoIcon />
                      </Button>
                    </Grid>
                    <Grid className="delete-ride-container" item xs={1}>
                      {ride.finished
                        ? <div></div>
                        : <div>
                          <div>
                            <DeleteIcon onClick={() => this.setState({ openDeleteConfirmation: true, rideToDelete: ride })} className="clickable" />
                          </div>
                          <div>
                            <input onChange={(e) => { this.handleRideSelection(e, ride) }} className="select-ride" type="checkbox" />
                          </div>
                        </div>
                      }

                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            )) :
              <Grid item xs={12} className="informative-message">
                <h3>You have no rides</h3>
              </Grid>
            }
            <PendingRequests
              open={this.state.openRideInfo}
              rideRequests={this.state.requests.filter(x => x.rideId === this.state.selectedRide.rideId)}
              ride={this.state.selectedRide}
              passengers={this.state.passengers.filter(x => x.rideId === this.state.selectedRide.rideId)}
              handleClose={() => this.setState({ openRideInfo: false })}
              handleRequestResponse={(response, rideRequestId, rideId, driverEmail) => this.sendRequestResponse(response, rideRequestId, rideId, driverEmail)}
              showSnackBar={(message, variant) => { this.showSnackBar(message, variant, this) }}
            />
          </Grid>
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

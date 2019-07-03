import * as React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
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
import { RideInfo } from "./RideInfo";
import { Checkbox } from "@material-ui/core";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import api from "../../../helpers/axiosHelper"
import { CircularProgress } from "@material-ui/core";
import { SnackbarVariants, showSnackBar } from "../../../utils/SnackBarUtils"
import SnackBars from "../../common/Snackbars";
import ListCard from "../../common/ListCard"
import MultiselectButtons from "../../common/MultiselectButtons";
import GenericDialog from "../../common/GenericDialog";
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
          for (var i = 0; i < fetchedRides.length; i++) {
            if (fetchedRides[i].requests.length > 0) {
              requests = requests.concat(fetchedRides[i].requests);
              fetchedRides[i].requests = null;
            }
          }
          this.setState({ fetchedRides, requests, rides: fetchedRides.filter(x => !x.finished), loading: false });

        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        showSnackBar("Failed to load rides", 2, this)
      });
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  sendRequestResponse(response, rideRequestId, rideId, driverEmail) {
    let data = {
      RideRequestId: rideRequestId,
      Status: response,
      RideId: rideId,
      DriverEmail: driverEmail
    };
    api.put("/RideRequest", [data]).then(response => {
      if (response.status === 200) {
        if (response === 1) {
          let requests = [...this.state.requests];
          let request = requests.find(x => x.rideId === rideId);
          request.status = 1;
          request.seendByDriver = false;
          this.setState({ requests });
          showSnackBar("Request accepted", 0, this)
        } else {
          showSnackBar("Request denied", 0, this);
          this.setState({
            requests: this.state.requests.filter(
              x => x.rideRequestId !== rideRequestId
            ),
          });
        }

      }
    }).catch((error) => {
      if (error.response && error.response.status === 409) {
        showSnackBar(error.response.data, 2, this)
      }
      else {
        showSnackBar("Failed to respond to request", 2, this)
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
        showSnackBar("Rides deleted successfully", 0, this);
      });
    }).catch(error => {
      this.setState({ openDeleteConfirmation: false });
      showSnackBar("Failed to delete rides", 2, this);
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
    let checkboxes = document.getElementsByClassName("select-item");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = true;
    }
  }

  deselectAll() {
    this.setState({ selectedRides: [] });
    let checkboxes = document.getElementsByClassName("select-item");
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
          : <Grid container className="list-container" >
            <AppBar className="nav-tabs-container" position="static">
              <Tabs centered value={this.state.tabValue} onChange={((e, newValue) => this.handleChange(newValue))}>
                <Tab className="nav-tabs" label="Active" />
                <Tab className="nav-tabs" label="Obsolete" />
              </Tabs>
            </AppBar>
            <ConfirmationDialog
              open={this.state.openDeleteConfirmation}
              close={() => this.setState({ openDeleteConfirmation: false })}
              confirm={() => this.setState({ openDeleteConfirmation: false }, () => this.deleteRides())}
              deny={() => this.setState({ openDeleteConfirmation: false })}
              deleteMultipleMessage={"Are you sure want to delete selected rides ?"}
              deleteSingleMessage={"Are you sure want to delete this ride ?"}
              deleteMultiple={this.shouldDeleteMultipleRides()}
            />
            {
              this.state.selectedRides.length > 0
                ? <MultiselectButtons
                  selectAll={() => this.selectAll()}
                  deselectAll={() => this.deselectAll()}
                />
                : <div></div>
            }
            {this.state.rides.length > 0 ? this.state.rides.map((ride, index) => (
              <ListCard
                firstText={"From " + ride.route.fromAddress.street + " " + ride.route.fromAddress.number + ", " + ride.route.fromAddress.city}
                secondText={"To " + ride.route.toAddress.street + " " + ride.route.toAddress.number + ", " + ride.route.toAddress.city}
                thirdText={moment(ride.rideDateTime).format("dddd MMM DD hh:mm")}
                viewed={() => { this.setState({ selectedRide: ride, openRideInfo: true }) }}
                deleted={() => { this.setState({ openDeleteConfirmation: true, rideToDelete: ride }) }}
                selected={(e) => { this.handleRideSelection(e, ride) }}
                new={this.state.requests.filter(x => x.rideId === ride.rideId && (!x.seenByDriver)).length > 0}
                index={index}
                disabled={ride.finished}
                newView={this.state.requests.filter(x => x.rideId === ride.rideId && (!x.requestNoteSeen)).length > 0}
              />
            )) :
              <Grid item xs={12} className="informative-message">
                <h3>You have no rides</h3>
              </Grid>
            }
            <GenericDialog
              open={this.state.openRideInfo}
              close={() => { this.setState({ openRideInfo: false }) }}
              content={
                <RideInfo
                  unaccpetedRequests={this.state.selectedRide ? this.state.requests.filter(x => x.status !== 1 && x.rideId === this.state.selectedRide.rideId) : []}
                  accpetedRequests={this.state.selectedRide ? this.state.requests.filter(x => x.status === 1 && x.rideId === this.state.selectedRide.rideId) : []}
                  ride={this.state.selectedRide}
                  handleClose={() => this.setState({ openRideInfo: false })}
                  handleRequestResponse={(response, rideRequestId, rideId, driverEmail) => this.sendRequestResponse(response, rideRequestId, rideId, driverEmail)}
                  showSnackBar={(message, variant) => { showSnackBar(message, variant, this) }}
                />
              }
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

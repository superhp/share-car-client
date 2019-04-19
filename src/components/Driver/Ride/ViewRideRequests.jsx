import * as React from "react";

import api from "../../../helpers/axiosHelper";
import { PassengerRideRequestsList } from "../../Passenger/Ride/PassengerRideRequestsList";
import { DriverRideRequestsList } from "./DriverRideRequestList";
import { Status } from "../../../utils/status"
import SnackBars from "../../common/Snackbars";
import { SnackbarVariants } from "../../common/SnackbarVariants"
export class ViewRideRequests extends React.Component {
  state = {
    driverRequests: [],
    passengerRequests: [],
    snackBarClicked: false,
    snackBarMessage: null,
    snackBarVariant: null
  };

  componentWillMount() {
    this.props.driver
      ? this.showDriverRequests(this.props.selectedRide)
      : this.showPassengerRequests();
  }
  handleRequestClick(rideRequestId) {
    this.setState({
      driverRequests: this.state.driverRequests.filter(
        x => x.rideRequestId !== rideRequestId
      )
    });
  }

  coordinatesToLocation(latitude, longitude) {
    return new Promise(function (resolve, reject) {
      fetch(
        "//eu1.locationiq.com/v1/reverse.php?key=ad45b0b60450a4&lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&format=json"
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          resolve(json);
        }).catch((error) => {
          this.showSnackBar("Something went wrong", 2)
        });
    });
  }

  cancelRequest(id) {
    var requests = this.state.passengerRequests;
    var index = requests.findIndex(x => x.rideRequestId === id);
    var request = requests[index];

    let data = {
      RideRequestId: request.rideRequestId,
      Status: Status[4],
      RideId: request.rideId,
      DriverEmail: request.driverEmail
    };
    api.put("RideRequest", data).then(res => {
      if (res.status === 200) {
        requests[index].status = 4;
        this.setState({ passengerRequests: requests });
      }
    })
      .catch(error => {
        this.showSnackBar("Failed to cancel request", 2)
      });

  }

  showPassengerRequests() {
    api
      .get("RideRequest")
      .then(response => {
        if (response.data !== "") {
          this.setState({ passengerRequests: response.data });
        }
      })
      .then(() => {
        const unseenRequests = [];

        for (let i = 0; i < this.state.passengerRequests.length; i++) {
          if (!this.state.passengerRequests[i].seenByPassenger) {
            unseenRequests.push(this.state.passengerRequests[i].rideRequestId);
          }
        }

        if (unseenRequests.length !== 0) {
          api.post("RideRequest/seenPassenger", unseenRequests).then(res => {
          });
        }
      })
      .catch((error) => {
        this.showSnackBar("Failed to load requests", 2)
      });
  }

  showDriverRequests(id) {
    api
      .get("RideRequest/" + id)
      .then(response => {
        if (response.status === 200)
          this.setState({ driverRequests: response.data });
      })
      .then(() => {
        const unseenRequests = [];

        for (let i = 0; i < this.state.driverRequests.length; i++) {
          if (!this.state.driverRequests[i].seenByDriver) {
            unseenRequests.push(this.state.driverRequests[i].rideRequestId);
          }
        }

        if (unseenRequests.length !== 0) {
          api.post("RideRequest/seenDriver", unseenRequests).then(res => {
          });
        }
      })
      .catch((error) => {
        this.showSnackBar("Failed to load requests", 2)
      });
  }

  sendRequestResponse(button, response, rideRequestId, rideId, driverEmail) {
    this.props.onRequestClick(button, rideRequestId);
    let data = {
      RideRequestId: rideRequestId,
      Status: response,
      RideId: rideId,
      DriverEmail: driverEmail
    };
    api.put("https://localhost:44347/api/RideRequest", data).then(res => {
      if (res.status === 200) {
        if (response === 1) {
          this.props.showSnackBar("Request accepted", 0)
          var request = this.props.rideRequests.find(x => x.rideRequestId === rideRequestId);
          this.setState(prevState => ({
            passengers: [...prevState.passengers, { firstName: request.passengerFirstName, passengerLastName: request.lastName, phone: request.phone }],
            clickedRequest: true
          }));
        } else {
          this.showSnackBar("Request denied", 0)
          this.setState({ clickedRequest: true });
        }
      }
    }).catch((error) => {
      if (error.response && error.response.status === 409) {
        this.showSnackBar(error.response.data, 2)
      } else {
        this.showSnackBar("Failed to request ride", 2)
      }
    });
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
        {this.props.driver ? (
          <DriverRideRequestsList
            showSnackBar={(message, variant) => { this.showSnackBar(message, variant) }}
            onRequestClick={this.handleRequestClick.bind(this)}
            selectedRide={this.props.selectedRide}
            rideRequests={
              this.props.selectedRide !== null && this.state.driverRequests !== []
                ? this.state.driverRequests.filter(
                  x => x.rideId === this.props.selectedRide
                )
                : []
            }
          />
        ) : (
            <PassengerRideRequestsList
              showSnackBar={(message, variant) => { this.showSnackBar(message, variant) }}
              requests={this.state.passengerRequests}
              cancelRequest={id => { this.cancelRequest(id) }}
            />
          )}
        <SnackBars
          message={this.state.snackBarMessage}
          snackBarClicked={this.state.snackBarClicked}
          variant={this.state.snackBarVariant}
        />
      </div>
    );
  }
}

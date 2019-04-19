import * as React from "react";
import "typeface-roboto";

import { PendingRequests } from "./PendingRequests";

import "../../../styles/riderequests.css";
import "../../../styles/genericStyles.css";

export class DriverRideRequestsList extends React.Component {

  render() {
    return (
      <div>
        <PendingRequests
          rideRequests={this.props.requests}
          rides={this.props.rides}
          selectedRide={this.props.selectedRide}
          handleRequestResponse={(button, response, rideRequestId, rideId, driverEmail) =>
            this.props.handleRequestResponse(button, response, rideRequestId, rideId, driverEmail)}
          passengers={this.props.passengers}
          showSnackBar={(message, variant) => {this.props.showSnackBar(message, variant)}}
          handleClose={() => this.props.handleClose()}
          open={this.props.open}
        />
      </div>
    );
  }
}

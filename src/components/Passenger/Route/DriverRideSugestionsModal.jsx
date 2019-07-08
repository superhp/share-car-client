import * as React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Close from '@material-ui/icons/Close';
import List from "@material-ui/core/List";
import api from "../../../helpers/axiosHelper";
import { DriverRideSuggestionItem } from "./DriverRideSuggestionItem";
import TextField from "@material-ui/core/TextField";

import "../../../styles/driversRidesList.css";

class DriverRideSugestionsModal extends React.Component {

  state = {
    note:null
  }

  registerToRide(ride) {
    const request = {
      RideId: ride.rideId,
      DriverEmail: ride.driverEmail,
      RequestNote: this.state.note,
      Address: {
        Longitude: this.props.passengerAddress.longitude,
        Latitude: this.props.passengerAddress.latitude
      }
    };

    api.post(`RideRequest`, request).then(response => {
      let rides = [...this.props.rides];
      let index = rides.indexOf(ride);
      rides[index].requested = true;
      this.props.showSnackBar("Ride requested!", 0);
      //this.props.updateRides();
    })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          this.props.showSnackBar(error.response.data, 2);
        } else {
          this.props.showSnackBar("Failed to request ride", 2);
        }
      });
  }

  render() {
    return (
      <div className="drivers-suggestion-modal">
        <div className="drivers-suggestion-list">
          <List>
            {this.props.rides.map((ride, index) => (
              <DriverRideSuggestionItem
                key={index}
                dateTime={ride.rideDateTime}
                requested={ride.requested}
                register={() => { this.registerToRide(ride) }}
              />
            ))}
          </List>
          </div>
          <div className="ride-request-note">
                        <TextField
                            margin="normal"
                            multiline
                            fullWidth
                            variant="outlined"
                            placeholder="Leave a note for drivers"
                            onBlur={(e) => {this.setState({note: e.target.value})}}
                        />
                    </div>
      </div>
    );
  }
}

export default DriverRideSugestionsModal;
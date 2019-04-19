import * as React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "@material-ui/icons/Info";
import "typeface-roboto";

import "../../../styles/driversRidesList.css";
import "../../../styles/genericStyles.css";
import { PendingRequests } from "./PendingRequests";

let moment = require("moment");

const style = {
  margin: "1em 0",
}

export class DriversRidesList extends React.Component {
  state = {
    open: false
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <Grid container>
        {this.props.rides.length > 0 ? this.props.rides.map((ride, index) => (
          <Grid style={style} key={index} item xs={12}>
            <Card className="rides-card generic-card">
              <Grid container className="active-rides-card-container">
                <Grid item xs={8}>
                  {this.props.requests.filter(x => x.rideId === ride.rideId && (!x.seenByDriver || !x.requestNoteSeen)).length > 0
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
                <Grid item xs={4} className="list-buttons">
                  <Button
                    onClick={() => {
                      this.props.onRideClick(ride.rideId);
                      this.handleClickOpen();
                    }}
                    variant="contained"
                    size="small"
                    className="show-drivers"
                  >
                    View
                          <InfoIcon />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      this.props.onDelete(ride);
                      this.props.onRideClick(ride.rideId);
                    }}
                    variant="contained"
                    className="delete-button"
                  >
                    Delete
                          <DeleteIcon />
                  </Button>
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
          open={this.state.open}
          rideRequests={this.props.requests.filter(x => x.rideId === this.props.selectedRide)}
          ride={this.props.rides.find(x => x.rideId === this.props.selectedRide) ? this.props.rides.find(x => x.rideId === this.props.selectedRide) : null}
          passengers={this.props.passengers.filter(x => x.rideId === this.props.selectedRide)}
          handleClose={() => this.handleClose()}
          handleRequestResponse={(response, rideRequestId, rideId, driverEmail) => this.props.handleRequestResponse(response, rideRequestId, rideId, driverEmail)}
          showSnackBar={(message, variant) => { this.props.showSnackBar(message, variant) }}
        />
      </Grid>
    );
  }
}

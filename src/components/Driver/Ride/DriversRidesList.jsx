import * as React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import "typeface-roboto";

import "../../../styles/driversRidesList.css";
import "../../../styles/genericStyles.css";
import { PendingRequests } from "./PendingRequests";

let moment = require("moment");

const standardStyle = {
  margin: "1em 0"
};
const finishedStyle = {
  margin: "1em 0",
  opacity: 0.5
};

export class DriversRidesList extends React.Component {
  state = {
    open: false,
    openDelete: false
  };

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }
  handleDeleteClickOpen() {
    this.setState({ openDelete: true });
  }

  handleDeleteClose() {
    this.setState({ openDelete: false });
  }

  render() {
    return (
      <Grid container>
        {this.props.rides.length > 0 ? (
          this.props.rides.map((ride, index) => (
            <Grid
              style={ride.finished ? finishedStyle : standardStyle}
              key={index}
              item
              xs={12}
            >
              <Card className="rides-card generic-card">
                <Grid container className="active-rides-card-container">
                  <Grid item xs={10}>
                    {this.props.requests.filter(
                      x =>
                        x.rideId === ride.rideId &&
                        (!x.seenByDriver || !x.requestNoteSeen)
                    ).length > 0 ? (
                      <Badge
                        className="rides-badge"
                        badgeContent={"new"}
                        color="primary"
                        children={""}
                      />
                    ) : null}
                    <CardContent
                    className="view-info-btn"
                      onClick={() => {
                        this.props.onRideClick(ride.rideId);
                        this.handleClickOpen();
                      }}
                    >
                      <Typography className="generic-color" component="p">
                        From {ride.route.fromAddress.street}{" "}
                        {ride.route.fromAddress.number},{" "}
                        {ride.route.fromAddress.city}
                      </Typography>
                      <Typography color="textSecondary">
                        To {ride.route.toAddress.street}{" "}
                        {ride.route.toAddress.number},{" "}
                        {ride.route.toAddress.city}
                      </Typography>
                      <Typography color="textSecondary">
                        {moment(ride.rideDateTime).format(
                          "dddd MMM DD YYYY hh:mm"
                        )}
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={2} className="list-buttons">
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
                    
                    
                  </Grid>
                  <Grid item xs={0}>
                  {ride.finished ? (
                      <div />
                    ) : (
                      <div>
                        <CloseIcon
                          className="delete-button-small"
                          onClick={() => {
                              this.handleDeleteClickOpen();
                          }}
                        />
                      </div>
                    )}
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} className="informative-message">
            <h3>You have no rides</h3>
          </Grid>
        )}
        <PendingRequests
          open={this.state.open}
          rideRequests={this.props.requests.filter(
            x => x.rideId === this.props.selectedRide
          )}
          ride={
            this.props.rides.find(x => x.rideId === this.props.selectedRide)
              ? this.props.rides.find(x => x.rideId === this.props.selectedRide)
              : null
          }
          passengers={this.props.passengers.filter(
            x => x.rideId === this.props.selectedRide
          )}
          handleClose={() => this.handleClose()}
          handleRequestResponse={(
            response,
            rideRequestId,
            rideId,
            driverEmail
          ) =>
            this.props.handleRequestResponse(
              response,
              rideRequestId,
              rideId,
              driverEmail
            )
          }
          showSnackBar={(message, variant) => {
            this.props.showSnackBar(message, variant);
          }}
        />
        
      </Grid>
    );
  }
}

import React, { Component } from "react";
import UserService from "../../services/userService";
import { PassengerRideRequestsList } from "./Ride/PassengerRideRequestsList";
import { CircularProgress, withStyles, Grid, Card } from "@material-ui/core";
import { styles } from "../../utils/spinnerStyle";
import "../../styles/genericStyles.css";
import "../../styles/viewDrivers.css";
import { DriverRoutesSuggestions } from "./Route/DriverRoutesSuggestions"

export default class ViewDrivers extends React.Component {

    render() {
        return (
            <div className="view-drivers-container">
                <Grid container item xs={12} >
                    <Card className="card">
                        View drivers
                        <Card>
                      <DriverRoutesSuggestions
                      routes={this.props.routes}
                      rides={this.props.rides}
                      showRoute = {(index) => {this.props.showRoute(index)}}
                      showRides = {(index) => {this.props.showRides(index)}}
                      onRegister={ride => this.props.onRegister(ride)}
                      handleNoteUpdate={(note) => {this.props.handleNoteUpdate(note)}}
                      passengerAddress={this.props.passengerAddress}
                      showSnackBar={(message, variant) => this.props.showSnackBar(message,variant)}
                      />
                        </Card>
                        </Card>
                    </Grid>
            </div>
        );
    }
}
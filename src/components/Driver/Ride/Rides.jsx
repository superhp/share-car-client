import React from "react";
import "typeface-roboto";

import api from "../../../helpers/axiosHelper";
import { DriversRidesList } from "./DriversRidesList";

import "../../../styles/genericStyles.css";
import SnackBars from "../../common/Snackbars";
import { CircularProgress } from "@material-ui/core";
import { SnackbarVariants, showSnackBar } from "../../../utils/SnackBarUtils"

export class Rides extends React.Component {
    state = {
        rides: [],
        requests: [],
        passengers: [],
        clicked: false,
        selectedRideId: null,
        snackBarClicked: false,
        snackBarMessage: null,
        snackBarVariant: null,
        loading: true
    };
    componentDidMount() {
        this.getDriversRides();
    }

    componentWillReceiveProps(props) {
        this.getDriversRides();
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

    handleRideDelete(rideToDelete) {
        api.put("Ride/disactivate", rideToDelete).then(res => {
            if (res.status === 200) {
                this.setState({
                    rides: this.state.rides.filter(
                        x => x.rideId !== rideToDelete.rideId
                    ),
                    clicked: false,
                    selectedRideId: null
                });
                showSnackBar("Ride successfully deleted", 0, this);
            }
        }).catch(() => {
            showSnackBar("Failed to delete ride", 2, this);
        });
    }

    handleClick(id) {
        this.setState({
            clicked: this.state.selectedRideId === id ? !this.state.clicked : true,
            selectedRideId: id
        });
    }

    getDriversRides() {
        this.setState({loading:true})
        api.get("Ride")
            .then(response => {
                if (response.status === 200) {

                    let rides = response.data;
                    let requests = [];
                    let passengers = [];
                    for (var i = 0; i < rides.length; i++) {
                        if (rides[i].requests.length > 0) {
                            requests = requests.concat(rides[i].requests);
                            rides[i].requests = null;
                        }
                        if (rides[i].passengers.length > 0) {
                            passengers = passengers.concat(rides[i].passengers);
                            rides[i].passengers = null;
                        }
                    }
                    this.setState({ rides: rides, requests: requests, passengers: passengers, loading: false });

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
                    showSnackBar("Request accepted", 0, this)

                } else {
                    showSnackBar("Request denied", 0, this)
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
                showSnackBar(error.response.data, 2, this)
            }
            else {
                showSnackBar("Failed to respond to request", 2, this)
            }
        });
    }

    render() {

        return (
            <div>
                {this.state.loading ?
                    <div className="progress-circle">
                        <CircularProgress />
                    </div>
                    : <DriversRidesList
                        onDelete={this.handleRideDelete.bind(this)}
                        handleRequestResponse={(response, rideRequestId, rideId, driverEmail) => { this.sendRequestResponse(response, rideRequestId, rideId, driverEmail) }}
                        selectedRide={this.state.selectedRideId}
                        rideClicked={this.state.clicked}
                        onRideClick={this.handleClick.bind(this)}
                        rides={this.state.rides}
                        requests={this.state.requests}
                        passengers={this.state.passengers}
                        showSnackBar={(message, variant) => { showSnackBar(message, variant, this) }}
                    />
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
export default Rides;

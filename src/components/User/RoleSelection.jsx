//@flow
import React, { Component } from "react";
import { Link } from "react-router-dom";

import UserService from "../../services/userService";
import AuthenticationService from "../../services/authenticationService";
import history from "../../helpers/history";
import RideCompletedNotification from "../Passenger/Ride/RideCompletedNotification";
import api from "../../helpers/axiosHelper";
import { RoleContext } from "../../helpers/roles";

import "../../styles/roleSelection.css";
import driverLogo from "../../images/driver.png";
import passengerLogo from "../../images/passenger.png";
import { CircularProgress, withStyles } from "@material-ui/core";
import {styles} from "../../utils/spinnerStyle";
import "../../styles/genericStyles.css";

class RoleSelection extends Component<RoleSelectionState, MyProfileState> {
  userService = new UserService();
  authService = new AuthenticationService();

  state = {
    loading: true,
    user: null,
    rideNotifications: [],
    showNotification: false,
    roleSelection: {
      isDriver: null
    }
  };

  componentDidMount() {
    api.get(`/Ride/checkFinished`).then(response => {
      this.setState({rideNotifications : response.data});
      if (response.data.length !== 0) {
        this.setState({showNotification : true});
      } else {
        this.setState({showNotification : false});
      }
      this.userService.getLoggedInUser(this.updateLoggedInUser);
    });
  }

  updateLoggedInUser = (user: UserProfileData) => {
    this.setState({ loading: false, user: user });
  };

  logout = () => {
    this.authService.logout(this.userLoggedOut);
  };

  userLoggedOut = () => {
    history.push("/login");
  };

  handleRoleSelection(isDriver) {
    let currentState = this.state.roleSelection;
    currentState.isDriver = isDriver;
    this.setState({ roleSelection: currentState });
  }

  render() {
    const content = this.state.loading ? 
      <div className="progress-circle">
        <CircularProgress/>
      </div>
     : this.state.user === null ? (
      <p>Failed</p>
    ) : (
      <div>
        {this.state.showNotification ? (
          <RideCompletedNotification rides={this.state.rideNotifications} />
        ) : (
          <div />
        )}
        <RoleContext.Consumer>
          {({ role, changeRole }) => (
            <div className="role-container">
              <Link to="/driver/rides" onClick={changeRole("driver")}>
                <img className="role-image" src={driverLogo} alt=""/>
              </Link>
              <h2 className="role-selection">Driver</h2>

              <Link to="/passenger/Requests" onClick={changeRole("passenger")}>
                <img className="role-image" src={passengerLogo} alt=""/>
              </Link>
              <h2 className="role-selection">Passenger</h2>
            </div>
          )}
        </RoleContext.Consumer>
      </div>
    );
    return <div>{content}</div>;
  }
}
export default withStyles(styles) (RoleSelection);

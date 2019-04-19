// @flow
import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { Router, Switch } from "react-router";

import UserService from "../../services/userService";
import AuthenticationService from "../../services/authenticationService";
import history from "../../helpers/history";
import { ViewRideRequests } from "./Ride/ViewRideRequests";
import { CircularProgress, withStyles } from "@material-ui/core";
import { styles } from "../../utils/spinnerStyle";
import "../../styles/genericStyles";

class Driver extends Component<{}, MyProfileState> {
  userService = new UserService();
  state: MyProfileState = { loading: true, user: null };

  componentDidMount() {
    this.userService.getLoggedInUser(this.updateLoggedInUser);
    this.props.isDriver === null ? history.push("/") : null;
  }

  updateLoggedInUser = (user: UserProfileData) => {
    this.setState({ loading: false, user: user });
  };

  render() {
    const content = this.state.loading ? 
      <div className="progress-circle">
        <CircularProgress/>
      </div>
     : this.state.user === null ? (
      <p>Failed</p>
    ) : (
      <div className="role-container">
        <h1 className="role-container">Driver Page</h1>
        <ViewRideRequests driver={true} />
      </div>
    );
    return <div>{content}</div>;
  }
}

export default withStyles(styles) (Driver);

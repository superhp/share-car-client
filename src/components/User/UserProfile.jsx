// @flow
import React, { Component } from "react";
import { withAlert } from "react-alert";
import "typeface-roboto";

import SnackBars from "../common/Snackbars";
import { SnackbarVariants } from "../common/SnackbarVariants";
import api from "../../helpers/axiosHelper";
import UserService from "../../services/userService";
import { UserProfileForm } from "./UserProfileForm";

import "../../styles/userProfile.css";
import { CircularProgress, withStyles } from "@material-ui/core";
import { styles } from "../../utils/spinnerStyle";
import "../../styles/genericStyles.css";

type UserProfileState = {
  loading: boolean,
  user: UserProfileData | null,
  snackBarClicked: boolean,
  snackBarMessage: string,
  snackBarVariant: string
};

class UserProfile extends Component<{}, UserProfileState, LayoutProps, MyProfileState> {
  state: MyProfileState = { loading: true, user: null, points: 0 };
  userService = new UserService();

  componentDidMount() {
    this.userService.getLoggedInUser(user => this.updateUserProfile(user.user));

    api.get("user/getPoints").then((response) => {
      this.setState({ points: response.data })
    }).catch(() => {
      this.setState({
        snackBarClicked: true,
        snackBarMessage: "Failed to get points",
        snackBarVariant: SnackbarVariants[2]
      });
    });

  }

  updateUserProfile = (user: UserProfileData) => {
    this.setState({ loading: false, user: user });
  };

  handleSubmit(e) {
    e.preventDefault();
    let data = {
      firstName: this.state.user.firstName,
      lastName: this.state.user.lastName,
      profilePicture: this.state.user.pictureUrl,
      email: this.state.user.email,
      licensePlate: this.state.user.licensePlate,
      phone: this.state.user.phone
    };
    api.post(`https://localhost:44347/api/user`, data).then(res => {
      if (res.status === 200) {
        this.setState({
          snackBarClicked: true,
          snackBarMessage: "Profile updated!",
          snackBarVariant: SnackbarVariants[0]
        });
      }
    });
  }

  render() {
    const content = this.state.loading ?
      <div className="progress-circle">
        <CircularProgress />
      </div>
      : this.state.user === null ? (
        <p>The user failed to load</p>
      ) : (
          <UserProfileForm
            onClick={() => this.logout()}
            onNameChange={e => this.setState({ user: { ...this.state.user, firstName: e.target.value } })}
            onSurnameChange={e => this.setState({ user: { ...this.state.user, lastName: e.target.value } })}
            onPhoneChange={e => this.setState({ user: { ...this.state.user, phone: e.target.value } })}
            onLicenseChange={e => this.setState({ user: { ...this.state.user, licensePlate: e.target.value } })}
            onButtonClick={e => {
              this.handleSubmit(e);
              setTimeout(
                function () {
                  this.setState({
                    snackBarClicked: false
                  });
                }.bind(this),
                3000
              );
            }}
            user={this.state.user}
            role={this.props.match.params.role}
            points={this.state.points}
          />
        );

    return (
      <div>
        {content}{" "}
        <SnackBars
          message={this.state.snackBarMessage}
          snackBarClicked={this.state.snackBarClicked}
          variant={this.state.snackBarVariant}
        />
        ;
      </div>
    );
  }
}

export default withStyles(styles)(withAlert(UserProfile));

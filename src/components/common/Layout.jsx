// @flow
import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";

import UserService from "../../services/userService";
import AuthenticationService from "../../services/authenticationService";

import NavBar from "./NavBar";
import { LinksToHeadings } from "../LinkDictionary";
import history from "../../helpers/history";

import "../../styles/layout.css";
import "../../styles/genericStyles.css";
import MenuListHeader from "./MenuListHeader";
import Media from "react-media";

type LayoutProps = {
  children?: React.Node
};

class Layout extends React.Component<LayoutProps, MyProfileState> {
  state: UserProfileData = { loading: true, user: null };
  userService = new UserService();
  authService = new AuthenticationService();

  componentDidMount() {
    this.userService.getLoggedInUser(this.updateLoggedInUser);
  }

  updateLoggedInUser = (user: UserProfileData) => {
    this.setState({ user: user });
  };

  logout = () => {
    this.authService.logout(this.userLoggedOut);
  };

  refetch = () => {
    this.props.refetch();
  };

  userLoggedOut = () => {
    history.push("/login");
  };

  render() {
    return (
      <div className="app">
        <div className="content">
          <Grid container justify="center">
            <AppBar position="static" className="generic-container-color">
              <Toolbar className="top-header">
                <Grid item xs={12} sm={2} />
                <Grid item xs={12} sm={8} className="top-header-text">
                  <Typography variant="title" color="inherit">
                    {LinksToHeadings[this.props.location.pathname]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <MenuListHeader
                    user={this.state.user}
                    logout={() => this.logout()}
                    refetch={() => this.refetch()}
                    isDriver={
                      this.props.location.pathname.includes("driver")
                        ? true
                        : false
                    }
                  />
                </Grid>
              </Toolbar>
            </AppBar>
          </Grid>
          <div>
            {this.props.children}
            {this.props.location.pathname.includes("driver") ? (
              <NavBar isDriver={true} />
            ) : this.props.location.pathname.includes("passenger") ? (
              <NavBar isDriver={false} />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Layout;

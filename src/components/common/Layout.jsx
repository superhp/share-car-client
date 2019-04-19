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
import { SecondaryHeader } from "./SecondaryHeader";
import Media from "react-media";

type LayoutProps = {
  children?: React.Node
};

class Layout extends React.Component<LayoutProps, MyProfileState> {
  state : UserProfileData = { loading: true, user: null};
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
              <AppBar
                position="static"
                className="generic-container-color"
              >
                <Media query="(max-width: 713px)">
                  {matches => matches ? 
                    <div>
                      <Grid item xs={12} className="header-text heading-small-device">
                        <Typography variant="title" color="inherit">
                          {LinksToHeadings[this.props.location.pathname]}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <SecondaryHeader 
                          logout={() => this.logout()} 
                          refetch={() => this.refetch()}
                          isDriver={this.props.location.pathname.includes("driver") ? true : false}
                          className="secondary-header-small-device"
                        />
                      </Grid>
                    </div>
                    : <Toolbar>
                          <Grid item xs={12} sm={7}>
                            <Typography variant="title" color="inherit" className="header-big-device">
                              {LinksToHeadings[this.props.location.pathname]}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <SecondaryHeader 
                              logout={() => this.logout()} 
                              refetch={() => this.refetch()}
                              isDriver={this.props.location.pathname.includes("driver") ? true : false}
                            />
                          </Grid>
                      </Toolbar>
                    }
                </Media>
              </AppBar>
          </Grid>
          {this.props.children}
          {this.props.location.pathname.includes("driver") ? (
            <NavBar isDriver={true} />
          ) : this.props.location.pathname.includes("passenger") ? (
            <NavBar isDriver={false} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Layout;

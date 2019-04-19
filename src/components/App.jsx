
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { Router } from "react-router";
import history from "../helpers/history";
import Layout from "./common/Layout";
import Login from "./common/Login";
import RoleSelection from "./User/RoleSelection";
import Passenger from "./Passenger/Passenger";
import UserProfile from "./User/UserProfile";
import Rides from "./Driver/Ride/Rides";
import Manual from "./Manual";
import WinnerBoard from "./Winner/WinnerBoard";
import Map from "./Maps/Map";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

export default class App extends React.Component {
  state = {
    refetch: false
  }

  refetchData() {
    this.setState({ refetch: !this.state.refetch })
  }



  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/login" component={Login} />
          <Layout refetch={this.refetchData.bind(this)}>
            <Route exact path="/" component={RoleSelection} />
            <Route path="/passenger/Requests" render={(props) => <Passenger {...props} refetch={this.state.refetch} />} />

            <Route
              path="/:role(driver|passenger)/profile"
              render={(props) => <UserProfile {...props}  />}
            />

            <Route path="/:role(driver|passenger)/Manual" component={Manual} />

            <Route path="/:role(driver|passenger)/Map" render={(props) => <Map {...props} refetch={this.state.refetch} />} />
            <Route
              path='/:role(driver|passenger)/rides'
              render={(props) => <Rides {...props} refetch={this.state.refetch} />}
            />
            <Route
              path="/:role(driver|passenger)/winnerBoard"
              render={(props) => <WinnerBoard {...props} refetch={this.state.refetch} />}
            />
          </Layout>
        </Switch>
      </Router>
    );
  }
}

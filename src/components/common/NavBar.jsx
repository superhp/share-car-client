import * as React from "react";
import { Link } from "react-router-dom";
import Map from "@material-ui/icons/Map";
import NoteAdd from "@material-ui/icons/NoteAdd";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";
import Cached from "@material-ui/icons/Cached";
import Book from "@material-ui/icons/Book";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import "../../styles/navbar.css";
import Media from "react-media";
import history from "../../helpers/history";


export default class NavBar extends React.Component {
  state = {
    tabValue: this.getInitialTabValue()
  }

  componentDidMount() {
    this.status = this.props.isDriver ? "/driver" : "/passenger";
  }

  getInitialTabValue() {
    let urlParts = window.location.href.split('/');
    if(urlParts[urlParts.length - 1] === "map"){
      return 0;
    }
    return 1;
  }

  handleChange(newValue) {
    this.setState({ tabValue: newValue }, () => {
      if (newValue == 0) {
        history.push(this.status + "/map");
      } else {
        history.push(this.status + (this.props.isDriver ? "/rides" : "/requests"));
      }
    });
  }

  render() {
    return (
      <div className="navBar">

        <AppBar className="nav-tabs-container" position="static">
          <Tabs centered value={this.state.tabValue} onChange={((e, newValue) => this.handleChange(newValue))}>
            <Tab className="nav-tabs" label="Routes map" />
            <Tab className="nav-tabs" label={this.props.isDriver ? "Rides" : "Requests"} />
          </Tabs>
        </AppBar>
      </div>
    )
  };
};

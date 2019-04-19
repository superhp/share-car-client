import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import "react-infinite-calendar/styles.css"; // only needs to be imported once
import api from "../../../helpers/axiosHelper";
import "../../common/TimePickers";
import SnackBars from "../../common/Snackbars";
import { SnackbarVariants } from "../../common/SnackbarVariants";
import RideSchedulerHelper from "./RideSchedulerHelper";

const styles = {
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  }
};

class RidesScheduler extends React.Component {
  state = {
    selectedDates: [],
    time: "07:00",
    snackBarClicked: false,
    note: ""
  };

  handleNoteChange(note){
    this.setState({note});
  }

  handleSelect(e) {
    if (this.state.selectedDates.length > 0) {
      if (this.checkForDateDuplicate(e, this.state.selectedDates)) {
        let index = -1;
        for (let i = 0; i < this.state.selectedDates.length; i++) {
          if (this.state.selectedDates[i].getTime() === e.getTime()) {
            index = i;
            break;
          }
        }
        let clone = [...this.state.selectedDates];
        clone.splice(index, 1);
        this.setState(prevState => ({
          selectedDates: clone
        }));
      } else {
        this.setState(prevState => ({
          selectedDates: [...prevState.selectedDates, e]
        }));
      }
    } else {
      this.setState(prevState => ({
        selectedDates: [...prevState.selectedDates, e]
      }));
    }
  }

  handleCreate = () => {
    let ridesToPost = [];
    const { fromAddress, toAddress } = this.props.routeInfo;
    this.state.selectedDates.forEach(element => {
      ridesToPost.push(this.createRide(fromAddress, toAddress, element, this.state.note));
    });

    this.postRides(ridesToPost);
  };

  createRide(from, to, element, note) {

    const ride = {
      route:{
        FromAddress:{
          Number: from.number,
          Street: from.street,
          City: from.city,
          Country: "Lithuania",
          Longitude: from.longitude,
          Latitude: from.latitude,
        },
        ToAddress:{
          Number: to.number,
          Street: to.street,
          City: to.city,
          Country: "Lithuania",
          Longitude: to.longitude,
          Latitude: to.latitude,
        },
        Geometry: this.props.routeInfo.routeGeometry,
      },
      Note:note,
      rideDateTime:
        element.getFullYear() +
        "-" +
        (element.getMonth() + 1) +
        "-" +
        element.getDate() +
        "  " +
        this.state.time
    };
    return ride;
  }

  postRides(ridesToPost) {
    api.post("Ride", ridesToPost).then(res => {
      if (res.status === 200) {
        this.showSnackBar("Rides successfully created!", 0);
      }
    }).catch(() => {
      this.showSnackBar("Failed to create rides", 2);

    });
  }

  showSnackBar(message, variant) {
    this.setState({
      open: false,
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

  handleTime = value => {
    this.setState({ time: value });
  };

  checkForDateDuplicate = function (needle, haystack) {
    for (let i = 0; i < haystack.length; i++) {
      if (needle.getTime() === haystack[i].getTime()) {
        return true;
      }
    }
    return false;
  };

  render() {
    return (
      <div>
        <RideSchedulerHelper
          appBar={this.props.appBar}
          handleClose={() => this.handleClose()}
          flex={this.props.flex}
          selectedDates={this.state.selectedDates}
          handleNoteChange={(note) => this.handleNoteChange(note)}
          handleCreate={() => this.handleCreate()}
          handleSelect={e => this.handleSelect(e)}
          handleTime={value => this.handleTime(value)}
        />
        <SnackBars
          message={this.state.snackBarMessage}
          snackBarClicked={this.state.snackBarClicked}
          variant={this.state.snackBarVariant}

        />
      </div>
    );
  }
}

RidesScheduler.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RidesScheduler);

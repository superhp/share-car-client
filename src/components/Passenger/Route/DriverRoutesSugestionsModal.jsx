import * as React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { DriverRoutesSugestions } from "./DriverRoutesSugestions";

import "../../../styles/driversRidesList.css";

class DriverRoutesSugestionsModal extends React.Component {
    state = {
      open: false
    };
  
    handleClickOpen = () => {
      this.setState({open: true});
    };
  
    handleClose = value => {
      this.setState({open: false });
    };
  
    render() {
      return (
            <div className="drivers-sugestion-modal">
                <Button variant="contained" className="show-drivers" onClick={this.handleClickOpen}>
                    Show drivers
                </Button>
                <Dialog className="sugestion-modal-dialog" onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.open}>
                    <DriverRoutesSugestions
                      rides={this.props.rides}
                      onRegister={ride => this.props.onRegister(ride)}
                      handleNoteUpdate={(note) => {this.props.handleNoteUpdate(note)}}
                      />
                </Dialog>
            </div>
      );
    }
  }
  
  export default DriverRoutesSugestionsModal;
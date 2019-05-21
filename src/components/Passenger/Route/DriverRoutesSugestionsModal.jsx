import * as React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { DriverRoutesSugestions } from "./DriverRoutesSugestions";

import "../../../styles/driversRidesList.css";

class DriverRoutesSugestionsModal extends React.Component {

    render() {
      return (
            <div className="drivers-sugestion-modal">
                <Dialog className="sugestion-modal-dialog" aria-labelledby="simple-dialog-title" open={this.props.showDrivers}>
                    <DriverRoutesSugestions
                      closeModal={()=>{this.props.closeModal()}}
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
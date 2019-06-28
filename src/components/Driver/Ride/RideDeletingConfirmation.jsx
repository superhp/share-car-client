import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import api from "../../../helpers/axiosHelper";
import { PendingRequestCard } from "./PendingRequestCard";
import { RidePassengersList } from "./RidePassengersList";
import { Status } from "../../../utils/status";
import "../../../styles/genericStyles.css";
import { Note } from "../Note";
import Button from "@material-ui/core/Button";
import { DialogContent } from "@material-ui/core";

export class RideDeletingConfirmation extends React.Component {

    render() {
        return (
            <Dialog onClose={() => this.props.handleClose()} aria-labelledby="simple-dialog-title" open={this.props.open}>
                    <DialogTitle className="dialog-title">Are you sure want to delete {this.props.deleteMultipleRides ? "selected rides ?" : "this ride ?"}</DialogTitle>
                <DialogContent>
                  <div className="confirmation-button-container">
                    <Button
                                variant="contained"
                                className="cancel-btn"
                                onClick={() => { this.props.confirm() }}
                            >
                                Yes
                                        </Button>
                            <Button
                                variant="contained"
                                className="generic-dialog-btn"
                                onClick={() => { this.props.deny() }}
                            >
                                No
                                        </Button>
                                        </div>
                                        </DialogContent>
            </Dialog>
        );
    }
}
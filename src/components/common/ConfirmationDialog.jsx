import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItem from "@material-ui/core/ListItem";
import "../../styles/genericStyles.css";
import Button from "@material-ui/core/Button";
import { DialogContent } from "@material-ui/core";

export default class ConfirmationDialog extends React.Component {

    render() {
        return (
            <Dialog onClose={() => this.props.handleClose()} aria-labelledby="simple-dialog-title" open={this.props.open}>
                <DialogTitle className="dialog-title">{this.props.deleteMultiple ?  this.props.deleteMultipleMessage : this.props.deleteSingleMessage + " ?"}</DialogTitle>
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
import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import "../../styles/genericStyles.css";
import Map from "@material-ui/icons/Map";
import NoteAdd from "@material-ui/icons/NoteAdd";
import Close from "@material-ui/icons/Close";


export default class RideRequestInfo extends React.Component {

    render() {
        return (
            <Dialog className="dialog-body" open={this.props.open}>
                <div>
                <Close onClick={() => this.props.close()} className="dialog-close" />
                </div>
                <DialogContent className="dialog-content">
                {this.props.content}

                </DialogContent>
            </Dialog>
        )
    }
}
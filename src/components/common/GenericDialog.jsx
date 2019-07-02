import * as React from "react";
import Moment from "react-moment";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { Note } from "../Driver/Note";
import Badge from "@material-ui/core/Badge";
import MapComponent from "../Maps/MapComponent";
import { Status } from "../../utils/status";
import Grid from "@material-ui/core/Grid";
import "../../styles/riderequests.css";
import "../../styles/genericStyles.css";
import "../../styles/driversRidesList.css";
import "../../styles/note.css";
import Map from "@material-ui/icons/Map";
import NoteAdd from "@material-ui/icons/NoteAdd";
import Close from "@material-ui/icons/Close";


export default class RideRequestInfo extends React.Component {

    state = {
        showMap: false,
        showNotes: false,
    }

    render() {
        return (
            <Dialog className="dialog-body" open={this.props.open}>
                <div>
                <Close onClick={() => this.props.close()} className="dialog-close" />
                </div>
                <div className="dialog-content">
                {this.props.content}

                </div>
            </Dialog>
        )
    }
}
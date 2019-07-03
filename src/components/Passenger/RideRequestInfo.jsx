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
import "../../styles/genericStyles.css";
import "../../styles/driversRidesList.css";
import "../../styles/note.css";
import Map from "@material-ui/icons/Map";
import NoteAdd from "@material-ui/icons/NoteAdd";
import GenericDialog from "../common/GenericDialog"
export default class RideRequestInfo extends React.Component {

    state = {
        showMap: false,
        showNotes: false,
    }
    getDisplayName(address) {
        return address.number + " " + address.street + ", " + address.city;
    }
    render() {
        return (
            <div>
                <Card className="generic-card request-card-content">
                    <Typography className="generic-color" component="div" style={{ paddingBottom: "5px" }}>
                        Request for {this.props.request.driverFirstName} {this.props.request.driverLastName}
                    </Typography>
                    <Typography color="textPrimary" component="div" style={{ paddingBottom: "5px" }}>
                        From: {this.getDisplayName(this.props.request.route.fromAddress)}
                    </Typography>
                    <Typography color="textPrimary" component="div" style={{ paddingBottom: "5px" }}>
                        To: {this.getDisplayName(this.props.request.route.toAddress)}
                    </Typography>
                    <Typography color="textPrimary" component="div" style={{ paddingBottom: "5px" }}>
                        Date: <Moment date={this.props.request.rideDateTime} format="MM-DD HH:mm" />
                    </Typography>
                    <Typography color="textPrimary" component="div" style={{ paddingBottom: "5px" }}>
                        Status: {Status[parseInt(this.props.request.status)]}
                    </Typography>


                    <Grid container justify="center" style={{ marginBottom: "5px" }}>
                        {!this.props.request.rideNoteSeen ?

                            <Badge
                                className="rides-badge"
                                badgeContent={"new"}
                                color="primary"
                                children={""}
                            />
                            : null}
                        <Grid item xs={5} style={{ marginRight: "5px" }}>
                            <Button
                                fullWidth
                                variant="contained"
                                className="generic-colored-btn"
                                onClick={() => {
                                    this.setState({
                                        showNotes: !this.state.showNotes,
                                        showMap: false
                                    }, () => { this.props.noteSeen(this.props.request.rideRequestId) });
                                }}
                            >
                                <NoteAdd />
                            </Button>
                        </Grid>
                        <Grid item xs={5}>
                            <Button
                                fullWidth

                                variant="contained"
                                className="generic-colored-btn"
                                onClick={() => {
                                    this.setState({
                                        showMap: !this.state.showMap,
                                        showNotes: false
                                    });
                                }}
                            >
                                <Map />
                            </Button>
                        </Grid>
                    </Grid>
                </Card>

                {this.state.showNotes ? (
                    <Card className="generic-card request-card-content">
                        <DialogTitle className="dialog-title">Your note</DialogTitle>
                        <Note
                            note={this.props.request.requestNote}
                            updateNote={(note) => { this.props.updateNote(note, this.props.request.rideRequestId) }}
                        />
                        <DialogTitle className="dialog-title">Driver's note</DialogTitle>
                        <div className="note-container">
                            <TextField
                                disabled
                                id="outlined-disabled"
                                multiline
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={this.props.request.rideNote}
                            />
                        </div>
                    </Card>
                ) : (
                        <div></div>
                    )}
                {this.state.showMap ? (
                    <Card className="generic-card">
                        <MapComponent
                            pickUpPoint={{ longitude: this.props.request.address.longitude, latitude: this.props.request.address.latitude }}
                            route={this.props.request.route}
                            index={this.props.index}
                        />
                    </Card>
                ) : (
                        <div></div>
                    )}

            </div>
        )
    }
}
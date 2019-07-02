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
import GenericDialog from "../common/GenericDialog"
export default class RideRequestInfo extends React.Component {

    state = {
        showMap: false,
        showNotes: false,
    }
getDisplayName(address){
    return address.number + " " + address.street + ", " + address.city;
}
    render() {
        return (
            <div>
                <Card className="request-card generic-card">
                    <Grid container className="requests-card-container">
                        <Grid item xs={12}>
                            <CardContent >
                                <Typography className="generic-color" component="p">
                                    Request for {this.props.request.driverFirstName} {this.props.request.driverLastName}
                                </Typography>
                                <Typography color="textPrimary">
                                    From: {this.getDisplayName(this.props.request.route.fromAddress)}
                                </Typography>
                                <Typography color="textPrimary">
                                    To: {this.getDisplayName(this.props.request.route.toAddress)}
                                </Typography>
                                <Typography color="textPrimary">
                                    Date: <Moment date={this.props.request.rideDateTime} format="MM-DD HH:mm" />
                                </Typography>
                                <Typography color="textPrimary">
                                    Status: {Status[parseInt(this.props.request.status)]}
                                </Typography>
   
                                {!this.props.request.rideNoteSeen ?

                                    <Badge
                                        className="rides-badge"
                                        badgeContent={"new"}
                                        color="primary"
                                        children={""}
                                    />
                                    : null}
                                <Button
                                    variant="contained"
                                    className="view-notes"
                                    onClick={() => {
                                        this.setState({
                                            showNotes: !this.state.showNotes,
                                            showMap:false
                                        }, () => { this.props.noteSeen(this.props.request.rideRequestId) });
                                    }}
                                >
                                    <NoteAdd/>
                        </Button>
                       
                            <Button
                                variant="contained"
                                className="show-on-map"
                                onClick={() => {
                                    this.setState({
                                        showMap: !this.state.showMap,
                                        showNotes:false
                                    });
                                }}
                            >
                                <Map/>
                        </Button>
                        </CardContent>

                        </Grid>
                        </Grid>
                </Card>

                {this.state.showNotes ? (
                    <Card className="request-card">
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
                    <Card className="request-card request-map">
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
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

export class PendingRequests extends React.Component {

    seenRequests(requests) {
        const unseenRequests = [];
        for (let i = 0; i < requests.length; i++) {
            if (!requests[i].seenByDriver) {
                unseenRequests.push(requests[i].rideRequestId);
            }
        }
        if (unseenRequests.length !== 0) {
            api.post("RideRequest/seenDriver", unseenRequests).then(res => {
            });
        }
    }
    updateNote(text) {
        let data = {
            Text: text,
            RideId: this.props.ride.rideId,
        }
        api.post("Ride/updateNote", data).then().catch(() => {
            this.props.showSnackBar("Failed to update note", 2);
          });
    }

    requestNoteSeen(requestId){
        api.get("RideRequest/" + requestId).then().catch();
    }

    componentWillReceiveProps(props) {
        if (props.open) {
            this.seenRequests(props.rideRequests);
        }
    }

    render() {
        return (
            <Dialog onClose={() => this.props.handleClose()} aria-labelledby="simple-dialog-title" open={this.props.open}>
                <div className="pending-requests">
                    <DialogTitle className="dialog-title">Note</DialogTitle>
                    <Note
                        note={this.props.ride ? this.props.ride.note : null}
                        updateNote={(note) => {this.updateNote(note)}}
                    />
                    <DialogTitle className="dialog-title">Requests</DialogTitle>
                    <List>
                        {this.props.rideRequests.length > 0
                            ? this.props.rideRequests.map((req, index) => (
                                <ListItem key={index}>
                                    <PendingRequestCard
                                        req={req}
                                        index={index}
                                        requestNoteSeen={(requestId) => {this.requestNoteSeen(requestId)}}
                                        route={this.props.ride ? this.props.ride.route : null}
                                        onAcceptClick={() => this.props.handleRequestResponse(1, req.rideRequestId, req.rideId, req.driverEmail)}
                                        onDenyClick={() => { this.props.handleRequestResponse(2, req.rideRequestId, req.rideId) }}
                                    />
                                </ListItem>
                            ))
                            : <div className="no-requests-div">No requests</div>}
                    </List>
                    <DialogTitle className="dialog-title">Passengers</DialogTitle>
                    <RidePassengersList
                        passengers={this.props.passengers}
                        route={this.props.ride ? this.props.ride.route : null}
                    />
                </div>
            </Dialog>
        );
    }
}
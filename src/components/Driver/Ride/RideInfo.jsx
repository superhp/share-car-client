import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import api from "../../../helpers/axiosHelper";
import { RideRequestCard } from "./RideRequestCard";
import { Status } from "../../../utils/status";
import "../../../styles/genericStyles.css";
import { Note } from "../Note";
import Close from "@material-ui/icons/Close";

export class RideInfo extends React.Component {

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
        api.get("RideRequest/seenDriver/" + requestId).then().catch();
    }

    render() {
        return ( 
                <div className="pending-requests">
                    <DialogTitle className="dialog-title">Note</DialogTitle>
                    <Note
                        disabled = {this.props.ride ? this.props.ride.finished : false}
                        note={this.props.ride ? this.props.ride.note : null}
                        updateNote={(note) => {this.updateNote(note)}}
                    />
                    <DialogTitle className="dialog-title">Requests</DialogTitle>
                    <List>
                        {this.props.unaccpetedRequests.length > 0
                            ? this.props.unaccpetedRequests.map((request, index) => (
                                <ListItem key={index}>
                                    <RideRequestCard
                                        disabled = {this.props.ride.finished}
                                        request={request}
                                        index={index}
                                        requestNoteSeen={() => {this.requestNoteSeen(request.rideRequestId)}}
                                        route={this.props.ride ? this.props.ride.route : null}
                                        onAcceptClick={() => this.props.handleRequestResponse(1, request.rideRequestId, request.rideId, request.driverEmail)}
                                        onDenyClick={() => { this.props.handleRequestResponse(2, request.rideRequestId, request.rideId) }}
                                    />
                                </ListItem>
                            ))
                            : <div className="no-requests-div">No requests</div>}
                    </List>
                    <DialogTitle className="dialog-title">Passengers</DialogTitle>
                    <List>
                        {this.props.accpetedRequests.length> 0
                            ? this.props.accpetedRequests.map((request, index) => (
                                <ListItem key={index}>
                                    <RideRequestCard
                                        disabled = {true}
                                        request={request}
                                        index={index}
                                        requestNoteSeen={() => {this.requestNoteSeen(request.rideRequestId)}}
                                        route={this.props.ride ? this.props.ride.route : null}
                                    />
                                </ListItem>
                            ))
                            : <div className="no-requests-div">No passengers</div>}
                    </List>
    
                </div>
        );
    }
}
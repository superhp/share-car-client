import * as React from "react";
import { Status } from "../../../utils/status";
import Grid from "@material-ui/core/Grid";
import "../../../styles/riderequests.css";
import "../../../styles/genericStyles.css";
import api from "../../../helpers/axiosHelper";
import SnackBars from "../../common/Snackbars";
import { SnackbarVariants, showSnackBar } from "../../../utils/SnackBarUtils";
import PassengerRideRequestCard from "../PassengerRideRequestCard";
import { CircularProgress } from "@material-ui/core";
import ListCard from "../../common/ListCard"
import RideRequestInfo from "../RideRequestInfo";
import GenericDialog from "../../common/GenericDialog";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import MultiselectButtons from "../../common/MultiselectButtons";
let moment = require("moment");

export class PassengerRideRequestsList extends React.Component {
    state = {
        open: false,
        coordinates: null,
        route: null,
        requests: [],
        selectedRequests: [],
        snackBarClicked: false,
        snackBarMessage: null,
        snackBarVariant: null,
        loading: true,
        openDeleteConfirmation: false
    }

    componentDidMount() {
        this.showPassengerRequests();
    }

    componentWillReceiveProps(nextProps) {
        this.showPassengerRequests();
    }

    cancelRequest(id) {
        const { selectedRequests, requestToDelete } = this.state;
        let requests = this.state.selectedRequests;
        if (!requests.includes(requestToDelete)) {

            requests.push(requestToDelete);
        }
        requests.forEach(x => {
            x.status = Status[4]
        });
        console.log(requests)
        api.put("RideRequest", requests).then(res => {
            if (res.status === 200) {
                let requestsToUpdate = [...this.state.requests];
                requests.forEach(x => {
                    requestsToUpdate.find(y => y.requestId === x.requestId).status = Status[4];
                });
                this.setState({ requests: requests });
                showSnackBar("Request was canceled", 0, this);
            }
        })
            .catch(error => {
                showSnackBar("Failed to cancel request", 2, this);
            });

    }

    updateNote(note, requestId) {
        let data = {
            Text: note,
            RideRequestId: requestId
        };
        api.post("RideRequest/updateNote", data).then()
            .catch(error => {
                showSnackBar("Failed to update note", 2, this);
            });
    }

    showPassengerRequests() {
        this.setState({ loading: true });
        api.get("RideRequest/passenger")
            .then(response => {
                if (response.data !== "") {
                    this.setState({ requests: response.data, loading: false });
                }
            })
            .then(() => {
                let unseenRequests = [];

                for (let i = 0; i < this.state.requests.length; i++) {
                    if (!this.state.requests[i].seenByPassenger) {
                        unseenRequests.push(this.state.requests[i].rideRequestId);
                    }
                }

                if (unseenRequests.length !== 0) {
                    api.post("RideRequest/seenPassenger", unseenRequests).catch();
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                showSnackBar("Failed to load requests", 2, this)
            });
    }

    noteSeen(requestId) {
        api.get("RideRequest/seenPassenger/" + requestId).catch();
    }
    selectAll() {
        this.setState({ selectedRequests: this.state.rides });
        let checkboxes = document.getElementsByClassName("select-ride");
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
        }
    }

    deselectAll() {
        this.setState({ selectedRequests: [] });
        let checkboxes = document.getElementsByClassName("select-ride");
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
    }
    handleRequestSelection(e, request) {
        let selectedRequests = [...this.state.selectedRequests];

        if (e.target.checked) {
            selectedRequests.push(request);
        } else {
            const index = selectedRequests.indexOf(request);
            selectedRequests.splice(index, 1);
        }
        this.setState({ selectedRequests });
    }
    shouldDeleteMultipleRides() {
        const { selectedRequests, requestToDelete } = this.state;
        if (selectedRequests.includes(requestToDelete)) {
            if (selectedRequests.length > 1) {
                return true;
            } else {
                return false;
            }
        } else {
            if (selectedRequests.length > 0) {
                return true;
            }
        }
        return false;
    }
    render() {
        return (
            <div>
                {this.state.loading
                    ? <div className="progress-circle">
                        <CircularProgress />
                    </div>
                    : <Grid className="list-container" container>
                        <ConfirmationDialog
                            open={this.state.openDeleteConfirmation}
                            confirm={() => this.cancelRequest()}
                            deny={() => this.setState({ openDeleteConfirmation: false })}
                            deleteMultipleRides={this.shouldDeleteMultipleRides()}
                        />
                        {
                            this.state.selectedRequests.length > 0
                                ? <MultiselectButtons
                                    selectAll={() => this.selectAll()}
                                    deselectAll={() => this.deselectAll()}
                                />
                                : <div></div>
                        }
                        {this.state.requests.length > 0 ? this.state.requests.map((request, i) =>
                            <ListCard
                                firstText={"Request for " + request.driverFirstName + " " + request.driverLastName}
                                secondText={moment(request.rideDateTime).format("dddd MMM DD hh:mm")}
                                thirdText={"Status: " + Status[parseInt(request.status)]}
                                selected={(e) => this.handleRequestSelection(e, request)}
                                deleted={() => this.setState({ openDeleteConfirmation: true, requestToDelete: request })}
                                viewed={() => this.setState({ selectedRequest: request, open: true })}
                                index={i}
                                newView={!request.rideNoteSeen}
                                new={!request.seenByPassenger}
                            />
                        )
                            : <div className="informative-message"><h3>You have no requests</h3></div>
                        }
                        {this.state.open
                            ? <GenericDialog
                                open={this.state.open}
                                close={() => this.setState({ open: false })}
                                content={<RideRequestInfo
                                    request={this.state.selectedRequest}
                                    updateNote={(note, requestId) => { this.updateNote(note, requestId) }}
                                    noteSeen={(requestId) => { this.noteSeen(requestId) }}
                                />}
                            />
                            : <div></div>
                        }
                        <SnackBars
                            message={this.state.snackBarMessage}
                            snackBarClicked={this.state.snackBarClicked}
                            variant={this.state.snackBarVariant}
                        />
                    </Grid>
                }
            </div>
        )
    }
}            
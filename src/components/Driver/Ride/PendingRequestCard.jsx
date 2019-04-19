import * as React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Badge from "@material-ui/core/Badge";
import MapComponent from "../../Maps/MapComponent";

import "../../../styles/riderequests.css";
import "../../../styles/genericStyles.css";

export class PendingRequestCard extends React.Component {
    state = {
        showMap: false,
        showNote: false
    }

    onViewNoteClick(){
        this.setState({ showNote: !this.state.showNote }, () =>{
            if(!this.props.req.requestNoteSeen){
                this.props.requestNoteSeen(this.props.req.rideRequestId)
            }
        });
    }

    render() {
        return (
            <div>
                <Card className="rides-card generic-card">
                    <Grid container justify="center">
                        <Grid item xs={12} zeroMinWidth>
                            <Grid container justify="center" className="request-person-info">
                                {!this.props.req.seenByDriver? (
                                    <Badge
                                        className="new-badge"
                                        badgeContent={"new"}
                                        color="primary"
                                        children={""}
                                    />
                                ) : null}
                                <Typography className="name-para" component="p">
                                    #{this.props.index + 1} {this.props.req.passengerFirstName}{" "}
                                    {this.props.req.passengerLastName}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} zeroMinWidth>
                            <CardActions>
                                <Grid container spacing={16} className="pending-requests-container">
                                    <Grid item md={3} className="pending-request-button">
                                        <Button
                                            variant="contained"
                                            className="show-on-map"
                                            onClick={() => { this.setState({ showMap: !this.state.showMap }) }}
                                        >
                                            Show on map
                                        </Button>

                                    </Grid>
                                    <Grid item md={3} className="pending-request-button">
                                    {!this.props.req.requestNoteSeen ? (
                                    <Badge
                                        className="new-badge"
                                        badgeContent={"new"}
                                        color="primary"
                                        children={""}
                                    />
                                ) : null}
                                        <Button
                                            variant="contained"
                                            className="show-on-map"
                                            onClick={() => { this.onViewNoteClick() }}
                                        >
                                            View note
                                        </Button>
                                    </Grid>
                                    <Grid item md={6}>
                                        {this.props.req.status !== 4 ?
                                            <Grid container spacing={8}>
                                                <Grid item md={6} className="pending-request-button">
                                                    <Button
                                                        variant="contained"
                                                        className="accept"
                                                        onClick={() => this.props.onAcceptClick()}
                                                    >
                                                        Accept
                                                    </Button>
                                                </Grid>
                                                <Grid item md={6} className="pending-request-button">
                                                    <Button
                                                        variant="contained"
                                                        className="deny"
                                                        onClick={() => this.props.onDenyClick()}
                                                    >
                                                        Deny
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            : <p>
                                                Request was canceled
                                            </p>
                                        }
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </Grid>
                    </Grid>
                </Card>
                {this.state.showMap ?
                    <Card className="request-map rides-card generic-card">
                        <Grid container justify="center">
                            <Grid item xs={12} zeroMinWidth>
                                <MapComponent
                                    pickUpPoint={{ longitude: this.props.req.address.longitude, latitude: this.props.req.address.latitude }}
                                    route={this.props.route}
                                    index={this.props.index}
                                />
                            </Grid>
                        </Grid>
                    </Card>
                    : <div></div>
                }
                {this.state.showNote ?
                    <Card className="rides-card generic-card">
                                <TextField
                                    disabled
                                    multiline
                                    fullWidth
                                    margin="none"
                                    variant="outlined"
                                    value={this.props.req.requestNote}
                                />
                    </Card>
                    : <div></div>
                }
            </div>
        );
    }
}
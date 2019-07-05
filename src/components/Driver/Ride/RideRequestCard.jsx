import * as React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Badge from "@material-ui/core/Badge";
import MapComponent from "../../Maps/MapComponent";
import Map from "@material-ui/icons/Map";
import NoteAdd from "@material-ui/icons/NoteAdd";
import "../../../styles/genericStyles.css";

export class RideRequestCard extends React.Component {
    state = {
        showMap: false,
        showNote: false
    }

    onViewNoteClick() {
        this.setState({ showMap: false, showNote: !this.state.showNote }, () => {
            if (!this.props.request.requestNoteSeen) {
                this.props.requestNoteSeen()
            }
        });
    }
    getDisplayName(address) {
        return address.number + " " + address.street + ", " + address.city;
    }
    render() {
        return (
            <Card className="generic-card ride-request-card">
                <Grid container spacing={12} justify="center">
                    {!this.props.request.seenByDriver ? (
                        <Badge
                            className="new-badge"
                            badgeContent={"new"}
                            color="primary"
                            children={""}
                        />
                    ) : null}
                    <Grid item xs={12} zeroMinWidth container justify="center" direction="column">
                        <Typography className="generic-color" component="div">
                            {this.props.request.passengerFirstName}{" "}
                            {this.props.request.passengerLastName}
                        </Typography>
                        <Typography color="textPrimary" component="div">
                            {this.getDisplayName(this.props.request.address)}
                        </Typography>
                    </Grid>
                    <Grid container justify="center" item xs={12} >
                            <Grid container justify="center" direction="column" >
                                <Grid container justify="center" style={{marginBottom:"5px"}}>
                                    {!this.props.request.requestNoteSeen ? (
                                        <Badge
                                            className="new-badge"
                                            badgeContent={"new"}
                                            color="primary"
                                            children={""}
                                        />
                                    ) : null}
                                    <Grid item xs={5} style={{marginRight:"5px"}}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            className="generic-colored-btn"
                                            onClick={() => { this.onViewNoteClick() }}
                                        >
                                            <NoteAdd />
                                        </Button>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            className="generic-colored-btn"
                                            onClick={() => { this.setState({ showNote: false, showMap: !this.state.showMap }) }}
                                        >
                                            <Map />
                                        </Button>
                                    </Grid>
                                </Grid>
                                {this.props.request.status !== 4 
                                   ? this.props.disabled
                                        ? <div></div>
                                        : <Grid container justify="center">
                                            <Grid item xs={5} style={{marginRight:"5px"}}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    className="accept"
                                                    onClick={() => this.props.onAcceptClick()}
                                                >
                                                    Accept
                                                    </Button>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    className="deny"
                                                    onClick={() => this.props.onDenyClick()}
                                                >
                                                    Deny
                                                    </Button>
                                            </Grid>
                                        </Grid>
                                    : <Grid item>
                    <Typography color="textPrimary" component="div">
                            Request was canceled
                        </Typography>
                                    </Grid>
                                }
                            </Grid>





                    </Grid >
                </Grid >
                {
                    this.state.showMap ?
                        <Card className="generic-card">
                            <Grid container justify="center">
                                <Grid item xs={12} zeroMinWidth>
                                    <MapComponent
                                        pickUpPoint={{ longitude: this.props.request.address.longitude, latitude: this.props.request.address.latitude }}
                                        route={this.props.route}
                                        index={this.props.index}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                        : <div></div>
                }
                {
                    this.state.showNote ?
                        <Card className="generic-card">
                            <TextField
                                disabled
                                multiline
                                fullWidth
                                margin="none"
                                variant="outlined"
                                value={this.props.request.requestNote}
                            />
                        </Card>
                        : <div></div>
                }
            </Card >
        );
    }
}
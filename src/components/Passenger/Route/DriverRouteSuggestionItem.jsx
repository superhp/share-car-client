import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Moment from "react-moment";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../../../styles/genericStyles.css";
import "../../../styles/testmap.css";
import { DriverRideSuggestionItem } from "./DriverRideSuggestionItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import DriverRideSugestionsModal from "./DriverRideSugestionsModal";
export class DriverRouteSuggestionItem extends React.Component {

    state = {
        showRides: false,
        
    }

    render() {
        return (
            <ListItem className="drivers-list">
                <ListItemText
                    primary={<span>{this.props.route.driverFirstName} {this.props.route.driverLastName}</span>}
                    secondary={
                        <React.Fragment>
                            {/*this.props.route.rideDateTime !== null ?
                                <span>
                                    <Typography component="span" style={{ display: 'inline' }} color="textPrimary">
                                        Time: &nbsp;
                            </Typography>
                                    <Moment date={this.props.route.rideDateTime} format="MM-DD HH:mm" />                                    <br />
                                    <br />
                                </span>
                                : ""*/}
                            {this.props.route.driverPhone ?
                                <span>
                                    <Typography component="span" style={{ display: 'inline' }} color="textPrimary">
                                        Phone: &nbsp;
                            </Typography>
                                    {this.props.route.driverPhone}
                                </span>
                                : ""}
                        </React.Fragment>
                    }
                />
                <Button
                  variant="contained"
                  className={this.props.route.requested ? "generic-colored-btn disabled" : "generic-colored-btn"}
                  onClick={() => this.props.showRoute()}
                >
                    Show route
        </Button>
                <Button
                    variant="contained"
                    className={this.props.route.requested ? "generic-colored-btn disabled" : "generic-colored-btn"}
                    onClick={() => this.setState({showRides: true})}
                >
                    View rides
        </Button>
                <DriverRideSugestionsModal
                    routeId={this.props.route.routeId}
                    showRides={this.state.showRides}
                    closeModal={() => {this.setState({showRides:false})}}
                    passengerAddress={this.props.passengerAddress}
                    showSnackBar={(message, variant) => this.props.showSnackBar(message,variant)}
                />

            </ListItem>
        );
    }
}

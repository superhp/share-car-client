import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../../../styles/genericStyles.css";
import "../../../styles/testmap.css";
export class DriverRouteSuggestionsItem extends React.Component {

    render() {
        return (
            <ListItem className="drivers-list">
                <ListItemText
                    primary={<span>{this.props.ride.driverFirstName} {this.props.ride.driverLastName}</span>}
                    secondary={
                        <React.Fragment>
                            {this.props.ride.rideDateTime !== null ?
                                <span>
                                    <Typography component="span" style={{ display: 'inline' }} color="textPrimary">
                                        Time: &nbsp;
                            </Typography>
                                    {this.props.ride.rideDateTime.split("T").join(" ")}
                                    <br />
                                </span>
                                : ""}
                            {this.props.ride.driverPhone !== null ?
                                <span>
                                    <Typography component="span" style={{ display: 'inline' }} color="textPrimary">
                                        Phone: &nbsp;
                            </Typography>
                                    {this.props.ride.driverPhone}
                                </span>
                                : ""}
                        </React.Fragment>
                    }
                />
                <Button
                    variant="contained"
                    className={this.props.ride.requested ? "register-button-disabled" : "register-button"}
                    onClick={() => this.props.onRegister()}
                    disabled={this.props.ride.requested}
                >
                    Register
        </Button>
            </ListItem>
        );
    }
}

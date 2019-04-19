import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../../../styles/genericStyles.css";
import "../../../styles/testmap.css";

export const DriverRouteSuggestionsItem = props => (
    <ListItem className="drivers-list">
        <ListItemText
            primary={<span>{props.ride.driverFirstName} {props.ride.driverLastName}</span>}
            secondary={
                <React.Fragment>
                    {props.ride.rideDateTime !== null ?
                        <span>
                            <Typography component="span" style={{ display: 'inline' }} color="textPrimary">
                                Time: &nbsp;
                            </Typography>
                            {props.ride.rideDateTime.split("T").join(" ")}
                            <br />
                        </span>
                        : ""}
                    {props.ride.driverPhone !== null ?
                        <span>
                            <Typography component="span" style={{ display: 'inline' }} color="textPrimary">
                                Phone: &nbsp;
                            </Typography>
                            {props.ride.driverPhone}
                        </span>
                        : ""}
                </React.Fragment>
            }
        />
        <Button
            color="primary"
            variant="contained"
            className="register-button"
            onClick={() => props.onRegister()}
        >
            Register
        </Button>
    </ListItem>
);



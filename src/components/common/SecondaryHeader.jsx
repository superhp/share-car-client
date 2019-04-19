import * as React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import "../../styles/secondaryHeader.css";

export const SecondaryHeader = props => (
    <Grid className="secondary-header" container>
        <Button
            className="header-button"
            size="large"
            onClick={() => props.refetch()}

        >
            <RefreshIcon fontSize="large" />
        </Button>
        <Link to={props.isDriver ?  "/driver/profile" : "/passenger/profile"}>
            <Button 
                className="header-button profile"
                size="large"
            >
                <AccountCircleIcon />
            </Button>
        </Link>
        <Button 
            className="header-button"
            size="large"
            onClick={() => props.logout()}
        >
            Logout
        </Button>
    </Grid>
);
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Moment from "react-moment";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../../../styles/genericStyles.css";
import "../../../styles/testmap.css";
import api from "../../../helpers/axiosHelper";

export class DriverRideSuggestionItem extends React.Component {

    render() {
        return (
            <ListItem className="drivers-list">
               <ListItemText
                    secondary={
                        <React.Fragment>
                           { this.props.dateTime !== null ?
                                <span>
                                <Typography component="span" style={{ display: 'inline' }} color="textPrimary">
                                    Time: &nbsp;
                            </Typography>
                                <Moment date={this.props.dateTime} format="MM-DD HH:mm" /><br />
                                <br />
                            </span>
                            : "" }
                        </React.Fragment>
                    }
                />
                <Button
                    variant="contained"
                    className={this.props.requested ? "generic-btn-color disabled" : "generic-btn-color"}
                    onClick={() => this.props.register()}
                >
                    Register
        </Button>
            </ListItem>
        );
    }
}
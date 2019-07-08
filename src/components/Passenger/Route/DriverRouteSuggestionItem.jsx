import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Moment from "react-moment";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../../../styles/genericStyles.css";
import "../../../styles/testmap.css";
import ListSubheader from "@material-ui/core/ListSubheader";
import CalendarToday from "@material-ui/icons/CalendarToday";
import Place from "@material-ui/icons/Place";
import List from "@material-ui/core/List";
import DriverRideSugestionsModal from "./DriverRideSugestionsModal";
import GenericDialog from "../../common/GenericDialog";
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
                            {this.props.route.driverPhone ?
                                <span>
                                    <Typography component="span" style={{ display: 'inline' }} color="textPrimary">
                                        Phone: &nbsp;
                            </Typography>
                                    {this.props.route.driverPhone}
                                </span>
                                : ""}
                            <Typography className="generic-color" component="p">

                                From {this.props.route.fromAddress.street} {this.props.route.fromAddress.number}, {this.props.route.fromAddress.city}
                            </Typography>
                            <Typography color="textPrimary">
                                To {this.props.route.toAddress.street} {this.props.route.toAddress.number}, {this.props.route.toAddress.city}
                            </Typography>
                        </React.Fragment>
                    }
                />
                <Button
                    variant="contained"
                    className={this.props.route.requested ? "generic-colored-btn disabled" : "generic-colored-btn"}
                    onClick={() => this.props.showRoute()}
                >
                    <Place />
                </Button>
                <Button
                    variant="contained"
                    className={this.props.route.requested ? "generic-colored-btn disabled" : "generic-colored-btn"}
                    onClick={() => this.setState({ showRides: true })}
                >
                    <CalendarToday />
                </Button>
                {
                    this.state.showRides
                        ? <GenericDialog
                            open={this.state.showRides}
                            close={() => this.setState({ showRides: false })}
                            content={<DriverRideSugestionsModal
                                rides={this.props.route.rides}
                                passengerAddress={this.props.passengerAddress}
                                showSnackBar={(message, variant) => this.props.showSnackBar(message, variant)}
                            />}
                        />
                        : null
                }
            </ListItem>
        );
    }
}

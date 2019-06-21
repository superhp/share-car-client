import * as React from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import Close from "@material-ui/icons/Close";
import { DriverRouteSuggestionItem } from "./DriverRouteSuggestionItem";

import "../../../styles/driversRidesList.css";

export class DriverRoutesSuggestions extends React.Component {
    render() {
        return (
            <div className="drivers-list-root">
                <Close className="drivers-sugestion-close-icon" onClick={() => {this.props.closeModal()}}>
                </Close>
                <List
                    subheader={<ListSubheader component="div" className="drivers-list-header">Suggested drivers</ListSubheader>}
                >
                    {this.props.routes.map((route, index) => (
                        <DriverRouteSuggestionItem
                            key={index}
                            route={route}
                            showRoute = {() => {this.props.showRoute(index)}}
                            showRides = {() => {this.props.showRides(index)}}
                            passengerAddress={this.props.passengerAddress}
                            showSnackBar={(message, variant) => this.props.showSnackBar(message,variant)}
                        />
                    ))}
                    
                </List>
            </div>
        )
    }
}
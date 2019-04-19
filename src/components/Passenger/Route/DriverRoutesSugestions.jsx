import * as React from "react";

import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";

import { DriverRouteSuggestionsItem } from "./DriverRouteSuggestionsItem";

import "../../../styles/driversRidesList.css";

export class DriverRoutesSugestions extends React.Component {
    render() {
        return (
            <div className="drivers-list-root">
                <List
                    subheader={<ListSubheader component="div" className="drivers-list-header">Drivers for this route</ListSubheader>}
                >
                    {this.props.rides.map((ride, i) => (
                        <DriverRouteSuggestionsItem
                            key={i}
                            ride={ride}
                            onRegister={() => this.props.onRegister(ride)}
                        />
                    ))}
                    <div className="ride-request-note">
                        <TextField
                            margin="normal"
                            multiline
                            fullWidth
                            variant="outlined"
                            placeholder="Leave a note for drivers"
                            onBlur={(e) => {this.props.handleNoteUpdate(e.target.value)}}
                        />
                    </div>
                </List>
            </div>
        )
    }
}
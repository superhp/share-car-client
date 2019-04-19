import * as React from "react";
import Button from "@material-ui/core/Button";
import ImportExport from "@material-ui/icons/ImportExport";
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

import { AddressInput } from "../../common/AddressInput";
import { fromAlgoliaAddress } from "../../../utils/addressUtils";

import "../../../styles/testmap.css";
import SimpleMenu from "../../common/SimpleMenu";

export class DriverRouteInput extends React.Component {
    state = {
        open: true,
    };

    handleClick = () => {
        this.setState({ open: !this.state.open });
        };
    render() {
        return (
            <div className="map-input-selection">
                <List
                    component="nav"
                >
                    <ListItem button onClick={this.handleClick}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Route points" />
                        {this.state.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {this.props.routePoints.map((element, index) => (
                                index + 1 < this.props.routePoints.length
                                    ? <ListItem button className={this.props.nested}>
                                        <ListItemIcon>
                                            <AddressInput
                                                className="driver-route-input"
                                                key={index}
                                                index={index}
                                                deletable={true}
                                                removeRoutePoint={id => { this.props.removeRoutePoint(id) }}
                                                placeholder={this.props.isRouteToOffice ? "To location" : "From location"}
                                                onChange={(suggestion, index) => this.props.changeRoutePoint(fromAlgoliaAddress(suggestion), index)}
                                                displayName={this.props.routePoints[index + 1].displayName}
                                            />
                                        </ListItemIcon>
                                    </ListItem>
                                    : null
                            ))}

                        </List>
                    </Collapse>
                </List>
                <AddressInput
                    className="driver-route-input"
                    key={this.props.routePoints.length - 1}
                    index={this.props.routePoints.length - 1}
                    deletable={false}
                    removeRoutePoint={id => { this.props.removeRoutePoint(id) }}
                    placeholder={this.props.isRouteToOffice ? "To location" : "From location"}
                    onChange={(suggestion, index) => this.props.changeRoutePoint(fromAlgoliaAddress(suggestion), index)}
                    displayName=""

                />
                <div className="route-creation-input-buttons">
                    <Button
                        variant="contained"
                        className="select-office-menu"
                        onClick={() => {
                            this.props.changeDirection();
                        }}
                        aria-haspopup="true"
                    >
                        <ImportExport fontSize="medium" />
                    </Button>
                    <SimpleMenu
                        handleSelection={office => {
                            this.props.changeRoutePoint(office, -1);
                        }}
                    />
                </div>
            </div>
        );
    }
}

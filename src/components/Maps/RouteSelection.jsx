import * as React from "react";
import { AddressInput } from "../common/AddressInput";
import "../../styles/routeSelection.css";
import "../../styles/genericStyles.css";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Cached from "@material-ui/icons/Cached";
import Add from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { formAlgoliaAddress } from "../../utils/addressUtils";
import history from "../../helpers/history";
import { routePointType } from "../../utils/routePointTypes";

export default class RouteSelection extends React.Component<{}> {
    state = {
        open: true,
    };

    render() {
        return (
            <Card className="location-selection-container">
                <Grid container item xs={12} >

                    <Grid item xs={2} container className="direction-label-container">
                        <Grid item xs={12} className="direction-label-container">
                            <div className="direction-label-element">
                                <Typography component="p">
                                    From
                    </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} className="direction-label-container">
                            <div className="direction-label-element" >
                                <Typography className="direction-label" component="p">
                                    To
                    </Typography>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={8} className="direction-inputs">
                        <div
                            className={this.props.routePoints.length > 0 ? "location-input-container" : "location-input-container empty"}
                            onClick={() => { this.props.showLocationSelection(0, routePointType.first) }}
                        >
                            {this.props.routePoints.length > 0 ?
                                this.props.routePoints[0].displayName :
                                this.props.isRouteToOffice ? "From location" : "To location"}

                        </div>
                        {this.props.routePoints.length > 2
                            ? <List
                                component="nav"
                            >
                                <ListItem button onClick={this.handleClick}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText inset primary={this.state.open ? "Collapse" : "Expand"} />
                                    {this.state.open ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {this.props.routePoints.map((element, index) => (
                                            index + 1 < this.props.routePoints.length
                                                ? <ListItem button className={this.props.nested}>
                                                    <ListItemIcon>
                                                        {/* <AddressInput
                                                            onClick={() => { this.props.showLocationSelection(index + 1) }}
                                                            className="driver-route-input"
                                                            key={index}
                                                            index={index}
                                                            deletable={true}
                                                            removeRoutePoint={id => { this.props.removeRoutePoint(id) }}
                                                            placeholder={this.props.isRouteToOffice ? "To location" : "From location"}
                                                            onChange={(suggestion, index) => this.props.changeRoutePoint(formAlgoliaAddress(suggestion), index)}
                                                            displayName={this.props.routePoints[index + 1].displayName}
                                                        />*/}


                                                        <div
                                                            className={this.props.routePoints.length > 0 ? "location-input-container" : "location-input-container empty"}
                                                            onClick={() => { this.props.showLocationSelection(index, routePointType.intermediate) }}
                                                        >
                                                            {
                                                                this.props.routePoints.length > 0 ?
                                                                    this.props.routePoints[0].displayName : "Intermediate point"
                                                            }

                                                        </div>
                                                    </ListItemIcon>
                                                </ListItem>
                                                : null
                                        ))}
                                    </List>
                                </Collapse>
                            </List>
                            : <div></div>
                        }
                        <div
                            className={this.props.routePoints.length > 1 ? "location-input-container" : "location-input-container empty"}
                            onClick={() => { this.props.showLocationSelection(this.props.routePoints.length - 1, routePointType.last) }}
                        >
                            {this.props.routePoints.length > 0 ?
                                this.props.routePoints[0].displayName :
                                this.props.isRouteToOffice ? "To location" : "From location"}
                        </div>

                    </Grid>
                    <Grid item xs={2} container>
                        <Grid item xs={12} className="clickable-element">
                            <div className="generic-button">
                                <Cached />
                            </div>
                        </Grid>
                        <Grid item xs={12} className="clickable-element">
                            <div className="generic-button">
                                <Add />
                            </div>
                        </Grid>
                    </Grid>

                </Grid>
            </Card>
        );
    }
}

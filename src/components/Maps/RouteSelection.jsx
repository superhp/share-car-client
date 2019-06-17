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

    doRoutePointsExist() {
        const { routePoints } = this.props;
        if (routePoints.length > 0) {
            if (routePoints.filter(x => !x.displayName).length === routePoints.length) {
                return false;
            }
            return true;
        }
        return false;
    }

    render() {
        const routePoints = this.props.routePoints;
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
                        {routePoints.map((element, index) => (
                            element.routePointType === routePointType.intermediate
                                ?
                                <Grid item xs={12} className="direction-label-container">
                                    <div className="direction-label-element" >
                                        <Typography className="direction-label invisible" component="p">
                                            Q
                    </Typography></div>
                                </Grid>


                                : null
                        ))}
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
                            className={routePoints[0].displayName ? "location-input-container" : "location-input-container empty"}
                            onClick={() => { this.props.showLocationSelection(0, routePointType.first) }}
                        >
                            {
                                routePoints[0].displayName
                                    ? routePoints[0].displayName
                                    : "From location"
                            }
                        </div>

                        {routePoints.map((element, index) => (
                            element.routePointType === routePointType.intermediate
                                ? <div
                                    className={routePoints[index].displayName
                                        ? "location-input-container"
                                        : "location-input-container empty"}
                                    onClick={() => { this.props.showLocationSelection(index, routePointType.intermediate) }}
                                >
                                    {
                                        routePoints[index].displayName
                                            ? routePoints[index].displayName
                                            : "Intermediate point"
                                    }
                                </div>
                                : null
                        ))}
                        <div
                            className={routePoints.length > 0 &&
                                routePoints[routePoints.length - 1].displayName
                                ? "location-input-container"
                                : "location-input-container empty"}
                            onClick={() => { this.props.showLocationSelection(routePoints.length - 1, routePoints[routePoints.length - 1].routePointType.last) }}
                        >
                            {
                                routePoints[routePoints.length - 1].displayName
                                    ? routePoints[routePoints.length - 1].displayName
                                    : "To location"
                            }
                        </div>

                    </Grid>



                    <Grid item xs={2} container>
                        <Grid item xs={12} className="clickable-element">
                            <div
                                className={this.doRoutePointsExist() ? "generic-button" : "generic-button disabled"}
                                onClick={this.doRoutePointsExist() ? () => { this.props.changeDirection() } : null}
                            >
                                <Cached />
                            </div>
                        </Grid>
                        {routePoints.map((element, index) => (
                            element.routePointType === routePointType.intermediate
                                ?
                                <Grid item xs={12} className="clickable-element invisible">
                                    <div className="generic-button">
                                        <Add />
                                    </div>
                                </Grid>
                                : null

                        ))}
                        <Grid item xs={12} className="clickable-element">
                            <div
                                className={this.doRoutePointsExist() ? "generic-button" : "generic-button disabled"}
                                onClick={this.doRoutePointsExist() ? () => { this.props.addNewRoutePoint() } : null}
                            >
                                <Add />
                            </div>
                        </Grid>
                    </Grid>

                </Grid>
            </Card>
        );
    }
}

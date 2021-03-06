import * as React from "react";
import "../../styles/routeSelection.css";
import "../../styles/genericStyles.css";
import Cached from "@material-ui/icons/Cached";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
import MoreVert from "@material-ui/icons/MoreVert";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import UnfoldLess from "@material-ui/icons/UnfoldLess";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { routePointType } from "../../utils/routePointTypes";
import { OfficeAddresses } from "../../utils/AddressData";
import Tooltip from '@material-ui/core/Tooltip';

export default class RouteSelection extends React.Component<{}> {
    state = {
        expanded: true,
    };

    doRoutePointsExist() {
        const { routePoints } = this.props;
        if (routePoints.length > 0) {
            if (routePoints.filter(x => !x.displayName).length === routePoints.length) {
                return false;
            }
            return true;
        }
    }

    canCreateNewRoutePoint() {
        if (this.doRoutePointsExist()) {
            const { routePoints } = this.props;
            if (routePoints.filter(x => !x.displayName && x.routePointType === routePointType.intermediate).length > 0) {
                return false;
            }
            return true;
        }
        return false;
    }

    shouldShowError() {
        const { routePoints } = this.props;
        for (let i = 0; i < routePoints.length; i += routePoints.length - 1) {
            if (!routePoints[i].displayName) {
                return false;
            } else if (OfficeAddresses.filter(x =>
                x.longitude === routePoints[i].address.longitude &&
                x.latitude === routePoints[i].address.latitude).length > 0) {
                return false;
            }
        }
        return true;
    }

    inputFieldClassName(index) {
        const { routePoints } = this.props;
        if (routePoints[index].displayName) {
            if (this.shouldShowError()) {
                return "location-input-container invalid";
            }
            return "location-input-container";
        }
        return "location-input-container empty";
    }

    render() {
        const routePoints = this.props.routePoints;
        return (
            <div>
                    <Tooltip open = {this.shouldShowError()}title="Start or destination point must be Cognizant office" disableTouchListener>
                        <Card className="route-selection-container">
                            <Grid container item xs={12} >
                                <Grid item xs={2} container className="direction-label-container">
                                    <Grid item xs={12} className="direction-label-container">
                                        <div className="direction-label-element">
                                            <Typography component="p" className={this.shouldShowError() ? "invalid" : ""}>
                                                From
                                </Typography>

                                        </div>

                                    </Grid>
                                    {this.state.expanded
                                        ? routePoints.map((element, index) => (
                                            element.routePointType === routePointType.intermediate
                                                ?
                                                <Grid item xs={12} className="direction-label-container">
                                                    <div className="direction-label-element" >
                                                        <Typography className="invisible" component="p">
                                                            Q
                                        </Typography>
                                                    </div>
                                                </Grid>


                                                : null
                                        ))
                                        : <Grid item xs={12} className="direction-label-container invisible">
                                            <div className="direction-label-element" >
                                                <Typography className="invisible" component="p">
                                                    Q
                            </Typography>
                                            </div>
                                        </Grid>
                                    }
                                    <Grid item xs={12} className="expanding-element-container">
                                        <div className="expanding-element" >
                                            {routePoints.length > 2
                                                ? (
                                                    this.state.expanded

                                                        ? <div className="generic-button">
                                                            <UnfoldLess onClick={() => { this.setState({ expanded: false }) }} />
                                                        </div>

                                                        : <div className="generic-button">
                                                            <UnfoldMore onClick={() => { this.setState({ expanded: true }) }} />
                                                        </div>
                                                )
                                                : null
                                            }
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} className="direction-label-container">
                                        <div className="direction-label-element" >
                                            <Typography component="p" className={this.shouldShowError() ? "invalid" : ""}>
                                                To
                                </Typography>
                                        </div>
                                    </Grid>
                                </Grid>

                                <Grid item xs={8} className="direction-inputs">
                                    <div
                                        className={this.inputFieldClassName(0)}
                                        onClick={() => { this.props.showLocationSelection(0, routePoints[0].routePointType) }}
                                    >
                                        {
                                            routePoints[0].displayName
                                                ? routePoints[0].displayName
                                                : "From location"
                                        }
                                    </div>
                                    {this.state.expanded
                                        ? routePoints.map((element, index) => (
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
                                        ))
                                        : <div className="fold-container">
                                            <MoreVert />
                                        </div>
                                    }
                                    <div
                                        className={this.inputFieldClassName(routePoints.length - 1)}
                                        onClick={() => { this.props.showLocationSelection(routePoints.length - 1, routePoints[routePoints.length - 1].routePointType) }}
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
                                    {this.state.expanded
                                        ? routePoints.map((element, index) => (
                                            element.routePointType === routePointType.intermediate
                                                ? <Grid item xs={12} className="clickable-element">
                                                    <div className="generic-button" onClick={() => { this.props.removeRoutePoint(index) }}>
                                                        <Close />
                                                    </div>
                                                </Grid>
                                                : null

                                        ))
                                        : <Grid item xs={12} className="clickable-element invisible">
                                            <div className="generic-button">
                                                <Close />
                                            </div>
                                        </Grid>
                                    }
                                    {
                                        this.props.driver
                                            ? <Grid item xs={12} className="clickable-element">
                                                <div
                                                    className={this.canCreateNewRoutePoint() ? "generic-button" : "generic-button disabled"}
                                                    onClick={this.canCreateNewRoutePoint() ? () => { this.props.addNewRoutePoint() } : null}
                                                >
                                                    <Add />
                                                </div>
                                            </Grid>
                                            : null
                                    }
                                </Grid>
                            </Grid>
                        </Card>
                    </Tooltip>
            </div>
        );
    }
}

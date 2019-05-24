import * as React from "react";
import { AddressInput } from "../common/AddressInput";
import "../../styles/locationSelection.css";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Cached from "@material-ui/icons/Cached";
import Add from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";

export default class LocationSelection extends React.Component<{}> {

    render() {
        return (
            <Card className="location-selection-container">
                <Grid container >

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
                        <AddressInput
                            //  key={this.props.routePoints.length - 1}
                            //  index={this.props.routePoints.length - 1}
                            //   deletable={false}
                            //    removeRoutePoint={id => { this.props.removeRoutePoint(id) }}
                            //   placeholder={this.props.isRouteToOffice ? "To location" : "From location"}
                            //   onChange={(suggestion, index) => this.props.changeRoutePoint(fromAlgoliaAddress(suggestion), index)}
                            displayName=""
                        />
                        <AddressInput
                            //   key={this.props.routePoints.length - 1}
                            //   index={this.props.routePoints.length - 1}
                            //   deletable={false}
                            //  removeRoutePoint={id => { this.props.removeRoutePoint(id) }}
                            //  placeholder={this.props.isRouteToOffice ? "To location" : "From location"}
                            //  onChange={(suggestion, index) => this.props.changeRoutePoint(fromAlgoliaAddress(suggestion), index)}
                            displayName=""
                        />
                    </Grid>
                    <Grid item xs={2} container>
                        <Grid item xs={12} className="clickable-element">
                            <div className="clickable">
                                <Cached />
                            </div>
                        </Grid>
                        <Grid item xs={12} className="clickable-element">
                            <div className="clickable">
                                <Add />
                            </div>
                        </Grid>
                    </Grid>

                </Grid>
            </Card>
        );
    }
}

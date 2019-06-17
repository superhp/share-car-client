import * as React from "react";
import { AddressInput } from "../common/AddressInput";
import "../../styles/locationSelection.css";
import "../../styles/genericStyles.css";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Cached from "@material-ui/icons/Cached";
import Add from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Home from "@material-ui/icons/Home";
import Work from "@material-ui/icons/Work";
import Place from "@material-ui/icons/Place";
import Settings from "@material-ui/icons/Settings";
import { formAlgoliaAddress } from "../../utils/addressUtils";
import { OfficeAddressesMenu } from "../../utils/AddressData";
import { Link } from "react-router-dom";


export default class LocationSelection extends React.Component<{}> {
    state = {
        open: true,
        selectedAddress: null,
        currentRoutePoint: this.props.currentRoutePoint,
    };

    render() {
        return (
            <Grid container item xs={12} >
                <Grid item xs={12} container className="location-selection-element">
                    <Grid item xs={12} >
                        <Card className="location-selection-element address-input">
                            <AddressInput
                                deletable={false}
                                removeRoutePoint={id => { this.props.removeRoutePoint(id) }}
                                placeholder={this.props.isRouteToOffice ? "To location" : "From location"}
                                onChange={(suggestion, index) => { this.props.selectLocation(formAlgoliaAddress(suggestion)) }}
                                displayName={this.props.currentRoutePoint ? this.props.currentRoutePoint.displayName : ""}
                                onClick={() => { }}
                            />
                        </Card>
                    </Grid>
                </Grid>
                <Grid item xs={12} container className="location-selection-element">
                    <Grid item xs={12}>
                        <Card className="location-selection-element"
                            onClick={() => { this.props.showRouteMap() }}>
                            <div className="location-icon">
                                <Place />
                            </div>
                            Select location on map
                    </Card>
                    </Grid>
                </Grid>
                <Grid item xs={12} container className="location-selection-element">
                    <Grid item xs={12}>
                        <Card className="location-selection-element"
                            onClick={() => {this.props.homeAddress ? this.props.selectLocation(this.props.homeAddress.address) : this.props.selectHomeAddress() }}
                        >
                            <div className="location-icon">
                                <Home />
                            </div>
                            {this.props.homeAddress
                                ? this.props.homeAddress.displayName
                                : "Select your home address"
                            }
                            {this.props.homeAddress
                                ?
                                <div className="generic-button settings" onClick={(e) => { e.stopPropagation(); this.props.selectHomeAddress()}}>
                                    <Settings />
                                </div>
                                :
                                <div></div>
                            }
                        </Card>
                    </Grid>
                </Grid>
                <Grid item xs={12} container className="location-selection-element">
                    <Grid item xs={12}>
                        <Card className="location-selection-element"
                            onClick={() => { this.props.selectLocation(OfficeAddressesMenu[0].value) }}>
                            <div className="location-icon">
                                <Work />
                            </div>
                            {OfficeAddressesMenu[0].label}
                        </Card>
                    </Grid>
                </Grid>
                <Grid item xs={12} container className="location-selection-element">
                    <Grid item xs={12}>
                        <Card className="location-selection-element"
                            onClick={() => { this.props.selectLocation(OfficeAddressesMenu[1].value) }}>
                            <div className="location-icon">
                                <Work />
                            </div>
                            {OfficeAddressesMenu[1].label}
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

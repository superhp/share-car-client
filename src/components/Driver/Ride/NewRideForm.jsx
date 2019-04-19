import * as React from "react";
import axios from "axios";

import addressParser from "../helpers/addressParser";
import api from "../../../helpers/axiosHelper";
import MapComponent from "../../Maps/MapComponent";
import { OfficeAddresses } from "../AddressData";
import { RideForm } from "./RideForm";

import "../../styles/newRideForm.css";
import "../../styles/genericStyles.css";

let moment = require("moment");
export class NewRideForm extends React.Component {
    state = {
        startDate: moment("2018-07-25", "YYYY-MM-DD").toDate(),
        addNewForm: false,
        addedStatus: false,
        addedOfficeAddress: true,
        fromAddress: null,
        toAddress: null
    };

    componentWillMount() {
        this.props.drive == null
            ? this.setState({ addNewForm: true })
            : this.setState({ addNewForm: false });
    }

    formAddress(number, street, city, country){
        const address = {
            number: number,
            street: street,
            city: city,
            country: country
        };
        return address;
    }

    componentDidMount() {
        if (!this.state.addNewForm) {
            this.setState({
                fromAddress: this.formAddress(this.props.drive.fromNumber, this.props.drive.fromStreet, 
                    this.props.drive.fromCity, this.props.drive.fromCountry)
            });
            this.setState({
                toAddress: this.formAddress(this.props.drive.toNumber, this.props.drive.toStreet, 
                    this.props.drive.toCity, this.props.drive.toCountry)
            });
        }
        let places = require("places.js");
        let placesAutocompleteFrom = places({
            container: document.querySelector("#address-input-from")
        });
        let placesAutocompleteTo = places({
            container: document.querySelector("#address-input-to")
        });

        placesAutocompleteFrom.on("change", e => {
            this.setState({
                fromAddress: this.formAddress(addressParser.parseAlgolioAddress(e.suggestion.name).number, 
                addressParser.parseAlgolioAddress(e.suggestion.name).name, e.suggestion.city, e.suggestion.country)
            });
            for (let i = 0; i < OfficeAddresses.length; i++) {
                if (this.state.fromAddress.country === OfficeAddresses[i].country
                    && this.state.fromAddress.city === OfficeAddresses[i].city
                    && this.state.fromAddress.street === OfficeAddresses[i].street
                    && this.state.fromAddress.number === OfficeAddresses[i].number
                ) {
                    this.setState({addedOfficeAddress: true});
                    break;
                }
                else {
                    this.setState({addedOfficeAddress: false});
                }
            }
        });
        placesAutocompleteTo.on("change", e => {
            this.setState({
                toAddress: this.formAddress(addressParser(e.suggestion.name).number, addressParser(e.suggestion.name).name, 
                e.suggestion.city, e.suggestion.country)
            });
        });
    }

    handleChange(date) {
        this.setState({
            startDate: moment(date, "YYYY-MM-DD").toDate()
        });
    }

    postRide(ride) {
        let rides = [];
        rides.push(ride);
        api.post(`https://localhost:44347/api/Ride`, rides).then(res => {
            this.setState({ addedStatus: true });
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let ride = {
            FromCountry: this.state.fromAddress.country,
            FromCity: this.state.fromAddress.city,
            FromStreet: this.state.fromAddress.street,
            FromNumber: this.state.fromAddress.number,
            ToCountry: this.state.toAddress.country,
            ToCity: this.state.toAddress.city,
            ToStreet: this.state.toAddress.street,
            ToNumber: this.state.toAddress.number,
            RideDateTime: this.state.startDate
        };
        if (this.state.addNewForm) {
            this.postRide(ride);
        } else {
            ride["RideId"] = this.props.drive.rideId;
            ride["DriverEmail"] = this.props.drive.driverEmail;
            this.postRide(ride);
        }
    }

    render() {
        return (
            <div className="container">
                {this.state.addedStatus ? (
                    <div className="alert alert-success added-label">Ride Added!</div>
                ) : ("")}
                <RideForm 
                    handleSubmit={() => this.handleSubmit()}
                    addNewForm={this.state.addNewForm}
                    drive={this.state.drive}
                    handleChange={() => this.handleChange()}
                    startDate={this.state.startDate}
                />
            </div>
        );
    }
}
export default NewRideForm;

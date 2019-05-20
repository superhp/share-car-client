import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import Autosuggest from 'react-autosuggest';
import SimpleMenu from "../../common/SimpleMenu";
import { AddressInput } from "../../common/AddressInput";
import { fromAlgoliaAddress } from "../../../utils/addressUtils";
import { OfficeAddressesMenu } from "../../../utils/AddressData";
import "./../../../styles/genericStyles.css";
import "./../../../styles/driverAutoSuggest.css";

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class PassengerRouteSelection extends React.Component {
    constructor(props) {
        super(props);
        this.autosuggestRef = React.createRef();
    }
    state = {
        address: this.props.initialAddress,
        direction: this.props.direction,
        value: '',
        users: [],
        suggestions: [],
        driverSelected: false
    }

    componentDidMount() {
        document.onclick = (e) => {
            if (this.autosuggestRef.current) {
                if (e.target !== this.autosuggestRef.current.input && document.activeElement === this.autosuggestRef.current.input) {
                    this.autosuggestRef.current.input.blur();

                    this.onBlur();
                }
            }
        };
    }

    onBlur = () => {
        var user = this.state.users.find(x => x.name === this.state.value);
        if (user) {
            this.props.onDriverSelection(user.email);
        } else {
            if (this.state.value === "") {
                this.props.onAutosuggestBlur(true);
            } else {
                this.props.onAutosuggestBlur(false);
            }
        }
        if (!this.state.driverSelected && this.state.value) {
                this.autosuggestRef.current.input.className = "react-autosuggest__input invalid-input";
                this.props.onDriverUnselection();
        }
    }

    componentWillReceiveProps(props) {
        var users = [];
        for (var i = 0; i < this.props.users.length; i++) {
            users.push({ name: this.props.users[i].firstName + " " + this.props.users[i].lastName, email: this.props.users[i].email });
        }
        this.setState({ users });
    }


    getSuggestions = value => {
        const escapedValue = escapeRegexCharacters(value.trim());
        if (escapedValue === '') {
            return [];
        }
        const regex = new RegExp('^' + escapedValue, 'i');
        const suggestions = this.state.users.filter(x => regex.test(x.name));

        return suggestions;
    }


    onChange = (event, { newValue, method }) => {

        this.setState({
            value: newValue,
            driverSelected: false
        });
    };

    getSuggestionValue = suggestion => {
        if (suggestion.isAddNew) {
            return this.state.value;
        }

        return suggestion.name;
    };

    renderSuggestion = suggestion => {
        return suggestion.name;
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        }, () => {
            if (this.state.suggestions.length === 0) {
                this.autosuggestRef.current.input.className = "react-autosuggest__input invalid-input";
            }
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });

    };

    onSuggestionSelected = (event, { suggestion }) => {
        this.setState({ driverSelected: true });
        this.props.onDriverSelection(suggestion.email);
    };

    handleFilterringChange(address, direction) {
        this.setState({ address: address, direction: direction });
        this.props.onChange(address, direction);
    }

    render() {
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Type driver\'s name',
            value,
            onChange: this.onChange,
            onBlur: this.onBlur
        };
        return (
            <div>

                <Grid item xs={12}>
                    <Grid item xs={12}
                        container
                        alignItems="center"
                        justify="center"
                    >
                        <AddressInput
                            displayName={this.props.displayName}
                            placeholder={this.state.direction == "to" ? "Your pick up point" : "Your destination point"}
                            onChange={(suggestion) => this.props.onMeetupAddressChange(fromAlgoliaAddress(suggestion))}
                        />
                    </Grid>
                    <Grid item xs={12}
                        container justify="center">
                        <SimpleMenu
                            dataset={[{ label: "From", value: "from" }, { label: "To", value: "to" }]}
                            handleSelection={(direction) => { this.handleFilterringChange(this.state.address, direction) }}
                        />
                        <SimpleMenu
                            dataset={OfficeAddressesMenu}
                            handleSelection={(address) => { this.handleFilterringChange(address, this.state.direction) }}
                        />

                    </Grid>
                    <Grid item xs={12}
                        container justify="center">

                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            onSuggestionSelected={this.onSuggestionSelected}
                            inputProps={inputProps}
                            ref={this.autosuggestRef}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

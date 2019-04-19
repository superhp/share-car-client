import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import Autosuggest from 'react-autosuggest';
import SimpleMenu from "../../common/SimpleMenu";
import { AddressInput } from "../../common/AddressInput";
import { fromAlgoliaAddress } from "../../../utils/addressUtils";

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
        suggestions: []
    }

    componentDidMount() {
        document.onclick = (e) => {
            if(this.autosuggestRef.current){
            if (e.target !== this.autosuggestRef.current.input && document.activeElement === this.autosuggestRef.current.input) {
                this.autosuggestRef.current.input.blur();
                this.onBlur();

            }}
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
            value: newValue
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
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });

    };

    onSuggestionSelected = (event, { suggestion }) => {
        this.props.onDriverSelection(suggestion.email);
    };

    handleFilterringChange(address, direction) {
        this.setState({ address: address, direction: direction });
        this.props.onChange(address, direction);
    }

    render() {
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Type a driver\'s name',
            value,
            onChange: this.onChange,
            onBlur: this.onBlur
        };
        return (
            <div>
                <Grid
                    className="from-to-container"
                    alignItems="flex-start"
                    justify="center"
                    container
                >
                    <Grid item xs={10}>
                        <Grid
                            container
                            alignItems="center"
                            justify="center"
                        >
                            <AddressInput
                                displayName={this.props.displayName}
                                placeholder="Type in meetup point or click on the map"
                                onChange={(suggestion) => this.props.onMeetupAddressChange(fromAlgoliaAddress(suggestion))}
                            />
                        </Grid>
                        <Card className="paper-background">
                            <Grid container justify="center">
                                <Grid
                                    container
                                    alignItems="center"
                                    justify="center"
                                    item xs={6}
                                >
                                    <Grid container item xs={6} justify="center">
                                        <Typography variant="body1">From office</Typography>
                                    </Grid>
                                    <Grid container item xs={6} justify="center">
                                        <Radio
                                            color="primary"
                                            checked={this.props.direction === "from"}
                                            onClick={() => { this.handleFilterringChange(this.state.address, "from") }}
                                            value="to"
                                            name="radio-button-demo"
                                            aria-label="A"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    alignItems="center"
                                    justify="center"
                                    item xs={6}
                                >
                                    <Grid container item xs={6} justify="center">
                                        <Typography variant="body1">To office</Typography>
                                    </Grid>
                                    <Grid container item xs={6} justify="center">
                                        <Radio
                                            color="primary"
                                            checked={this.props.direction === "to"}
                                            onClick={() => { this.handleFilterringChange(this.state.address, "to") }}
                                            value="from"
                                            name="radio-button-demo"
                                            aria-label="A"
                                        />
                                    </Grid>
                                </Grid>
                                <SimpleMenu
                                    handleSelection={(address) => { this.handleFilterringChange(address, this.state.direction) }}
                                />
                            </Grid>
                        </Card>
                    </Grid>
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

            </div>
        );
    }
}

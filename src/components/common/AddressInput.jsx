import * as React from "react";
import AlgoliaPlaces from "algolia-places-react";
import Close from "@material-ui/icons/Close";

import "../../styles/routeSelection.css";

export class AddressInput extends React.Component {
    constructor(props) {
        super(props);
        this.algoliaRef = React.createRef();

    }

    componentDidMount() {
        var places = require('../../../node_modules/places.js');
        this.placesAutocomplete = places({
            container: this.algoliaRef.current.autocomplete.autocomplete[0],
            language: 'lt',
            countries: ['lt'],
        });
        this.placesAutocomplete.setVal(this.props.displayName ? this.props.displayName : "");
    }

    componentWillReceiveProps(nextProps) {
        this.algoliaRef.current.autocompleteElem.placeholder = nextProps.placeholder;
        if (nextProps && this.algoliaRef.current && this.placesAutocomplete) {
            this.placesAutocomplete.setVal(nextProps.displayName ? nextProps.displayName : "");
            this.placesAutocomplete.close();
        }
    }

    render() {

        return (
            <div className="algolia-input">
                <AlgoliaPlaces
                    options={{
                        language: 'lt',
                        countries: ['lt']
                    }}
                    onChange={({ query, rawAnswer, suggestion, suggestionIndex }) => this.props.onChange(suggestion, this.props.index)}
                    onClick = {() => {this.props.onClick()}}
                    onBlur={() => {
                        if (this.placesAutocomplete.autocomplete[0].value === "" && this.props.displayName) {
                            this.placesAutocomplete.setVal(this.props.displayName);
                        }
                    }}
                    //onClear={() => this.props.onChange(null)}
                    ref={this.algoliaRef}
                    placeholder={this.props.placeholder}

                />
                {
                    this.props.deletable ?
                        <Close
                            className="remove-route-point"

                            onClick={() => { this.props.removeRoutePoint(this.props.index) }}
                        />
                        :
                        <div></div>
                }
            </div>
        );
    }
}
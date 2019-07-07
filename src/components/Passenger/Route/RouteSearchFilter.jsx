import * as React from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import Close from "@material-ui/icons/Close";
import { DriverRouteSuggestionItem } from "./DriverRouteSuggestionItem";
import { Grid, Card, DialogTitle } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autosuggest from 'react-autosuggest';
import FormGroup from '@material-ui/core/FormGroup';
import "../../../styles/driversRidesList.css";
import api from "../../../helpers/axiosHelper"
import InfiniteCalendar, {
    Calendar,
    withMultipleDates,
    defaultMultipleDateInterpolation
} from "react-infinite-calendar";
import TimePickers from "../../common/TimePickers";
import { defaultTime } from "../../common/TimePickers";
import { calendarStyle } from "../../../utils/calendarStyle";
import { weekdays } from "moment";
const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default class RouteSearchFilter extends React.Component {

    constructor(props) {
        super(props);
        this.autosuggestRef = React.createRef();
    }

    state = {
        value: this.props.filter.driver ? this.props.filter.driver.name : '',
        suggestions: [],
        driverSelected: false,
        step: 0,
        selectedDates: this.props.filter.dates,
        selectedDriver: this.props.filter.driver,
        startTime: this.props.filter.startTime,
        endTime: this.props.filter.endTime,
        monday: this.props.filter.weekDays[0],
        tuesday: this.props.filter.weekDays[1],
        wednesday: this.props.filter.weekDays[2],
        thursday: this.props.filter.weekDays[3],
        friday: this.props.filter.weekDays[4],
        showCalendar: false,
        timeChanged: false,
        driverChanged: false,
        datesChanged: false,
        weekDayChanged: false,
    }

    canApply() {
        const {
            timeChanged,
            datesChanged,
            weekDayChanged,
            driverChanged,
            step,
            selectedDriver,
            selectedDates,
            startTime,
            value,
            showCalendar,
            endTime } = this.state;

        if (step === 0) {
            if (showCalendar) {
                return datesChanged;
            } else {
                return weekDayChanged;
            }
        } else if (step === 1) {
            let notNull = (startTime !== null && endTime !== null);
            if (!notNull) {
                return false;
            }
            let hoursFrom = parseInt(startTime.split(':')[0]);
            let minutesFrom = parseInt(startTime.split(':')[1]);
            let hoursTo = parseInt(endTime.split(':')[0]);
            let minutesTo = parseInt(endTime.split(':')[1]);
            let notConflictingTime = ((hoursFrom < hoursTo) || (hoursFrom === hoursTo && minutesFrom < minutesTo));
            return (notConflictingTime && notNull && timeChanged);
        } else if (step === 2) {
            return (selectedDriver || value === '') && driverChanged;
        }
    }

    canClear(){
        if(this.canApply()){
            return true;
        }
        const {showCalendar, step} = this.state;
        if(step === 0){
            if(showCalendar){
            return this.state.selectedDates.length > 0;
            } else{
                return this.props.filter.weekDays.includes(true);
            }
        } else if(step === 1){
            return this.props.filter.startTime !== null;
        } else if(step === 2){
            return this.props.filter.driver !== null;
        }
    }

    onAutosuggestBlur(resetRoutes) {
        if (resetRoutes) {
            this.setState({ routes: this.state.fetchedRoutes, currentRouteIndex: 0 }, this.displayRoute);
        } else {
            this.setState({ routes: [], currentRouteIndex: 0 }, this.displayRoute);
        }
    }

    onBlur = () => {
        var user = this.props.users.find(x => x.name === this.state.value);
        if (user) {
            this.setState({ selectedDriver: user });
        } else {
            if (this.state.value === "") {
                this.onAutosuggestBlur(true);
            } else {
                this.onAutosuggestBlur(false);
            }
        }
        if (!this.state.driverSelected && this.state.value) {
            this.autosuggestRef.current.input.className = "react-autosuggest__input invalid-input";
            this.setState({ selectedDriver: null })
        }
    }

    getSuggestions = value => {
        const escapedValue = escapeRegexCharacters(value.trim());
        if (escapedValue === '') {
            return [];
        }
        const regex = new RegExp('^' + escapedValue, 'i');
        const suggestions = this.props.users.filter(x => regex.test(x.name));
        return suggestions;
    };


    onChange = (event, { newValue, method }) => {

        this.setState({
            value: newValue,
            driverSelected: false
        });
        this.setState({ driverInput: newValue })
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
        let suggestions = this.getSuggestions(value);
        this.setState({
            suggestions: suggestions,
            selectedDriver: suggestions.length > 0 ? this.state.selectedDriver : null
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
        this.setState({ driverSelected: true, selectedDriver: suggestion, driverChanged: true });
    };

    handleTime(time, start) {
        if (start) {
            this.setState({ startTime: time, timeChanged: true })
        } else {
            this.setState({ endTime: time, timeChanged: true })
        }
    }

    filterByWeekDays() {
        const { monday, tuesday, wednesday, thursday, friday } = this.state;
        this.props.filterByWeekDays([monday, tuesday, wednesday, thursday, friday]);
    }
    checkForDateDuplicate = function (needle, haystack) {
        for (let i = 0; i < haystack.length; i++) {
            if (needle.getTime() === haystack[i].getTime()) {
                return true;
            }
        }
        return false;
    };
    handleSelect(e) {
        if (this.state.selectedDates.length > 0) {
            if (this.checkForDateDuplicate(e, this.state.selectedDates)) {
                let index = -1;
                for (let i = 0; i < this.state.selectedDates.length; i++) {
                    if (this.state.selectedDates[i].getTime() === e.getTime()) {
                        index = i;
                        break;
                    }
                }
                let clone = [...this.state.selectedDates];
                clone.splice(index, 1);
                this.setState({ selectedDates: clone, datesChanged: true });
            } else {
                this.setState(prevState => ({
                    selectedDates: [...prevState.selectedDates, e], datesChanged: true
                }));
            }
        } else {
            this.setState(prevState => ({
                selectedDates: [...prevState.selectedDates, e], datesChanged: true
            }));
        }
    }
    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Type driver\'s name',
            value,
            onChange: this.onChange,
            onBlur: this.onBlur,
        };
        return (
            <div>
                <AppBar className="route-filter-tabs-container" position="static">
                    <Grid container justify="center">
                        <Grid item>
                            <Tab disableRipple={true} className="route-filter-tab" label="Filters" />
                        </Grid>
                    </Grid>

                    <Tabs centered value={this.state.step} onChange={(e, newValue) => this.setState({ step: newValue })}>
                        <Tab className="route-filter-tab" label="Date" />
                        <Tab className="route-filter-tab" label="Time" />
                        <Tab className="route-filter-tab" label="Drivers" />
                    </Tabs>
                </AppBar>
                {this.state.step === 0 && !this.state.showCalendar
                    ? <div className="filter-body">
                        <Grid container justify="space-between" direction="row">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.monday}
                                        onChange={() => this.setState({ monday: !this.state.monday, weekDayChanged: true })}
                                        color="primary"
                                    />
                                }
                                label="Monday"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.tuesday}
                                        onChange={() => this.setState({ tuesday: !this.state.tuesday, weekDayChanged: true })}
                                        color="primary"
                                    />
                                }
                                label="Tuesday"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.wednesday}
                                        onChange={() => this.setState({ wednesday: !this.state.wednesday, weekDayChanged: true })}
                                        color="primary"
                                    />
                                }
                                label="Wednesday"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.thursday}
                                        onChange={() => this.setState({ thursday: !this.state.thursday, weekDayChanged: true })}
                                        color="primary"
                                    />
                                }
                                label="Thursday"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.friday}
                                        onChange={() => this.setState({ friday: !this.state.friday, weekDayChanged: true })}
                                        color="primary"
                                    />
                                }
                                label="Friday"
                            />
                        </Grid>
                        <Grid container justify="space-between" direction="row">
                            <Grid item>
                                <Button
                                    variant="contained"
                                    className="generic-colored-btn"
                                    onClick={() => this.setState({ showCalendar: true, weekDayChanged: true })}
                                >
                                    Calendar
                        </Button>
                            </Grid>
                            <Grid item>
                                <Grid container justify="flex-end" spacing={8}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            className={this.canClear() ? "generic-colored-btn" : "generic-colored-btn disabled"}
                                            onClick={() => this.props.clearWeekdays()}
                                            disabled={!this.canClear()}
                                        >
                                            Clear
                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            className={this.canApply() ? "generic-colored-btn" : "generic-colored-btn disabled"}
                                            onClick={() => this.filterByWeekDays(true)}
                                            disabled={!this.canApply()}
                                        >
                                            Apply
                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </div>
                    : null
                }
                {
                    this.state.step === 1
                        ? <Grid container className="filter-body">
                            <Grid item xs={6} >
                                <TimePickers defaultValue={this.state.startTime} title="Time range start" onChange={(value) => { this.handleTime(value, true) }} />
                            </Grid>
                            <Grid item xs={6} >
                                <TimePickers defaultValue={this.state.endTime} title="Time range end" onChange={(value) => { this.handleTime(value, false) }} />
                            </Grid>
                            <Grid container justify="flex-end" spacing={8}>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        className={this.canClear() ? "generic-colored-btn" : "generic-colored-btn disabled"}
                                        onClick={() => this.props.clearTime()}
                                        disabled={!this.canClear()}
                                    >
                                        Clear
                        </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        onClick={() => this.props.filterByTime(this.state.startTime, this.state.endTime)}
                                        variant="contained"
                                        className={this.canApply() ? "generic-colored-btn" : "generic-colored-btn disabled"}
                                        disabled={!this.canApply()}
                                    >
                                        Apply
                        </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        : null
                }
                {
                    this.state.step === 2
                        ? <Grid container className="filter-body" justify="flex-end" >
                            <Grid item xs={12} style={{ marginBottom: "5px", marginTop: "5px" }}>
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
                            <Grid container spacing={8} item justify="flex-end">
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        className={this.canClear() ? "generic-colored-btn" : "generic-colored-btn disabled"}
                                        onClick={() => this.props.clearDriver()}
                                        disabled={!this.canClear()}
                                    >
                                        Clear
                        </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        className={this.canApply() ? "generic-colored-btn" : "generic-colored-btn disabled"}
                                        onClick={() => this.props.filterByDriver(this.state.selectedDriver)}
                                        disabled={!this.canApply()}
                                    >
                                        Apply
                        </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        : null
                }
                {this.state.step === 0 && this.state.showCalendar
                    ? <div className="filter-body">
                        <Grid item xs={12} container justify="center">
                            <Grid item xs={12} className="calendar-container">
                                <InfiniteCalendar
                                    onSelect={e => this.handleSelect(e)}
                                    Component={withMultipleDates(Calendar)}
                                    selected={this.state.selectedDates}
                                    displayOptions={{
                                        showHeader: false
                                    }}
                                    interpolateSelection={defaultMultipleDateInterpolation}
                                    width={(window.innerWidth <= 650) ? window.innerWidth - 150 : 550}
                                    height={window.innerHeight - 400}
                                    disabledDays={[0, 6]}
                                    minDate={new Date()}
                                    className="calendar"
                                    theme={calendarStyle}
                                />
                            </Grid>
                        </Grid>

                        <Grid container justify="space-between">
                            <Grid item>
                                <Button
                                    variant="contained"
                                    className="generic-colored-btn"
                                    onClick={() => this.setState({ showCalendar: false })}
                                >
                                    Weekdays
                        </Button>
                            </Grid>
                            <Grid item>
                                <Grid container justify="flex-end" spacing={8}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            className={this.canClear() ? "generic-colored-btn" : "generic-colored-btn disabled"}
                                            onClick={() => this.props.clearDates([])}
                                            disabled={!this.canClear()}
                                        >
                                            Clear
                        </Button>
                        </Grid>
                                        <Grid item>
                                        <Button
                                            onClick={() => this.props.filterByDates(this.state.selectedDates)}
                                            variant="contained"
                                            className={this.canApply() ? "generic-colored-btn" : "generic-colored-btn disabled"}
                                            disabled={!this.canApply()}
                                        >
                                            Apply
                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                    : null
                }
            </div>
        )
    }
}
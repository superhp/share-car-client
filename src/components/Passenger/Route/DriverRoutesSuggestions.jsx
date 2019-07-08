import * as React from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Close from "@material-ui/icons/Close";
import FilterList from "@material-ui/icons/FilterList";
import { DriverRouteSuggestionItem } from "./DriverRouteSuggestionItem";
import { Grid, Card } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "../../../styles/driversRidesList.css";
import "../../../styles/genericStyles.css";
import GenericDialog from "../../common/GenericDialog"
import RouteSearchFilter from "./RouteSearchFilter"
import { weekdays } from "moment";
const today = new Date();
export class DriverRoutesSuggestions extends React.Component {

    state = {
        show: false,
        showFilters: false,
        users: [],
        filteredRoutes: [],
        selectedWeekDays: [],
        selectedDates: [],
        selectedDriver: null,
        startTime: null,
        endTime:null,
     }

    componentDidMount() {
        let users = [];
        this.props.routes.forEach(x => {
            let name = x.driverFirstName + " " + x.driverLastName;
            if (users.filter(y => x.email === y.driverEmail).length === 0) {
                users.push({name: name, email: x.driverEmail});
            }
        });
        this.setState({ users, filteredRoutes: this.props.routes })
    }

    filter(clear) {
        const { selectedWeekDays, selectedDriver, selectedDates, startTime, endTime } = this.state;
        this.setState({ filteredRoutes: this.props.routes }, () => {
            let routes = [...this.state.filteredRoutes];
            if (selectedDriver) {
                routes = routes.filter(x => x.driverEmail === selectedDriver.email);
            }
            if (selectedWeekDays.includes(true)) {
                routes = this.filterByWeekDays(selectedWeekDays, routes);
            }
            if (selectedDates.length > 0) {
                routes = this.filterByDates(selectedDates, routes);
            }
            if (startTime && endTime) {
                routes = this.filterByTime(startTime, endTime, routes);
            }

            this.setState({ showFilters: false, filteredRoutes: routes }, () => {
                if (this.state.filteredRoutes.length > 0) {
                    this.props.showSnackBar(clear ? "Filters cleared" : "Filters changed", 0);
                } else {
                    this.props.showSnackBar("No drivers to suggest", 2);
                }
            });
        });
    }

    filterByTime(timeFrom, timeTo, routes) {
        let filteredRoutes = [];
        routes.filter(x => {
            let rides = [...x.rides];
            let filteredRides = [];
            rides.forEach(y => {
                let date = new Date(y.rideDateTime);
                let todayFrom = new Date(y.rideDateTime);
                let todayTo = new Date(y.rideDateTime);
                todayFrom.setHours(timeFrom.hour);
                todayFrom.setMinutes(timeFrom.minute);
                todayTo.setHours(timeTo.hour);
                todayTo.setMinutes(timeTo.minute);
                if (date.getTime() >= todayFrom.getTime() && date.getTime() <= todayTo.getTime()) {
                    filteredRides.push(y);
                }
            });
            if (filteredRides.length > 0) {
                let route = { ...x };
                route.rides = filteredRides;
                filteredRoutes.push(route);
            }
        });
        return filteredRoutes;
    }

    filterByDates(selectedDates, routes) {

        let filteredRoutes = [];

        routes.filter(x => {
            let rides = [...x.rides];
            let filteredRides = [];
            rides.forEach(y => {
                let date = new Date(y.rideDateTime);
                for (let i = 0; i < selectedDates.length; i++) {
                    if (date.getFullYear() === selectedDates[i].getFullYear() && date.getMonth() === selectedDates[i].getMonth() && date.getDate() === selectedDates[i].getDate()) {
                        filteredRides.push(y);
                    }
                }
            });
            if (filteredRides.length > 0) {
                let route = { ...x };
                route.rides = filteredRides;
                filteredRoutes.push(route);
            }
        });
        return filteredRoutes;
    }

    filterByWeekDays(weekDays, routes) {
        let filteredRoutes = [];

        routes.filter(x => {
            let rides = [...x.rides];
            let filteredRides = [];
            rides.forEach(y => {
                let date = new Date(y.rideDateTime);

                if (weekDays[date.getDay() - 1]) {
                    filteredRides.push(y);
                }
            });
            if (filteredRides.length > 0) {
                let route = { ...x };
                route.rides = filteredRides;
                filteredRoutes.push(route);
            }
        });
        return filteredRoutes;
    }

    render() {
        return (
            <div>
                {
                    this.state.show
                        ? <div className="driver-list-root">

                            <Grid container justify="space-between" item xs={12}>
                                <Grid item >
                                    <Button
                                        variant="contained"
                                        className="generic-colored-btn"
                                        onClick={() => this.setState({ showFilters: true })}
                                    >

                                        <FilterList />
                                    </Button>
                                </Grid>
                                <Grid item className="driver-list-header">
                                    Suggested drivers
                                                </Grid>
                                <Grid item>
                                    <Close onClick={() => { this.setState({ show: false }) }}>
                                    </Close>
                                </Grid>
                            </Grid>
                            <List className="suggested-driver-list">
                                <ListItem>
                                </ListItem>
                                {
                                    this.state.filteredRoutes.length > 0
                                        ? this.state.filteredRoutes.map((route, index) => (
                                            <DriverRouteSuggestionItem
                                                key={index}
                                                route={route}
                                                showRoute={() => { this.props.showRoute(index) }}
                                                showRides={() => { this.props.showRides(index) }}
                                                passengerAddress={this.props.passengerAddress}
                                                showSnackBar={(message, variant) => this.props.showSnackBar(message, variant)}
                                            />
                                        ))
                                        : <Grid container justify="center">
                                            <Grid item styles={{ paddingBottom: "10px" }}>
                                                No drivers to suggest with selected filters
                                            </Grid>
                                        </Grid>
                                }
                                                             
                            </List>
                            {
                                this.state.showFilters
                                    ? <GenericDialog
                                        open={this.state.showFilters}
                                        close={() => { this.setState({ showFilters: false }) }}
                                        white={true}
                                        visibleOverflow={true}
                                        content={
                                            <RouteSearchFilter
                                            overflowX={true}
                                                filter={{
                                                    weekDays: this.state.selectedWeekDays,
                                                    dates: this.state.selectedDates,
                                                    startTime: this.state.startTime,
                                                    endTime: this.state.endTime,
                                                    driver: this.state.selectedDriver
                                                }}
                                                users={this.state.users}
                                                filterByDriver={(selectedDriver) => { this.setState({ selectedDriver }, () => this.filter(false)) }}
                                                filterByTime={(startTime, endTime) => { this.setState({ startTime, endTime }, () => this.filter(false)) }}
                                                filterByWeekDays={(weekDays) => { this.setWeekDays(weekDays, false) }}
                                                filterByDates={(selectedDates) => { this.setState({ selectedDates }, () => this.filter(false)) }}
                                               
                                                clearDriver={(selectedDriver) => { this.setState({ selectedDriver: null }, () => this.filter(true)) }}
                                                clearTime={(startTime, endTime) => { this.setState({ startTime: null, endTime: null }, () => this.filter(true)) }}
                                                clearWeekDays={(weekDays) => { this.setState({ selectedWeekDays: [false, false, false, false, false] }, () => { this.filter(true)})}}
                                                clearDates={(selectedDates) => { this.setState({ selectedDates: [] }, () => this.filter(true)) }}
                                               
                                            />
                                        }
                                    />
                                    : null
                            }
                        </div>
                        : <div className="driver-list-button-container">
                            <Grid item xs={5} >
                                <Card className="driver-list-button" onClick={() => { this.setState({ show: true }) }}>
                                    Suggested drivers
                    </Card>
                            </Grid>
                        </div>
                }
            </div>
        )
    }
}
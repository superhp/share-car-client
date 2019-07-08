import * as React from "react";
import InfiniteCalendar, {
    Calendar,
    withMultipleDates,
    defaultMultipleDateInterpolation
} from "react-infinite-calendar";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import TimePickers from "../../common/TimePickers";
import TextField from "@material-ui/core/TextField";
import Checkbox from '@material-ui/core/Checkbox';
import "../../../styles/newRideForm.css";
import { calendarStyle } from "../../../utils/calendarStyle";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import RideSchedulerNavigation from "./RideSchedulerNavigation";
import "react-infinite-calendar/styles.css"; // only needs to be imported once
import api from "../../../helpers/axiosHelper";
import history from "../../../helpers/history";
import SnackBars from "../../common/Snackbars";
import { SnackbarVariants, showSnackBar } from "../../../utils/SnackBarUtils";
import { formatRelative } from "date-fns";
import 'react-times/css/classic/default.css';
import TimePicker from 'react-times';
const today = new Date();
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
const amountOfSteps = 4;
class RideScheduler extends React.Component {
    state = {
        openDialog: true,
        step: 0,
        title: "Set rides' recurrence",
        buttonTitle: "Go to calendar",
        monday: false,
        tuesday: false,
        wednesday: false,
        thurday: false,
        friday: false,
        selectedDates: [],
        time: null,
        snackBarClicked: false,
        note: ""
    };

    handleClose = () => {
        this.setState({ openDialog: false });
    };

    buttonClick() {
        const { step } = this.state;

        if (this.state.step === 0) {
            this.setState({ step: 1, buttonTitle: "Return to recurrence", title: "Set rides' recurrence" });
        } else if (this.state.step === 1) {
            this.setState({ step: 0, buttonTitle: "Go to calendar", title: "Select specific days" });
        }
    }

    navigation(direction) {
        let step = this.state.step;
        let previousStep = this.state.step;

        step += direction;

        if (step === 0) {
            this.setState({ step: 0, buttonTitle: "Go to calendar", showButton: true, title: "Set rides' recurrence" });
        } else if (step === 1) {
            if (previousStep === 0) {
                this.setState({ step: 2, showButton: false, title: "Choose rides' time" });
            } else {
                this.setState({ step: 0, buttonTitle: "Go to calendar", showButton: true, title: "Set rides' recurrence" });
            }
        } else if (step === 2) {
            this.setState({ step: 2, showButton: false, title: "Choose rides' time" });
        } else if (step === 3) {
            this.setState({ step: 3, showButton: false, title: "A note for your passengers" });
        }
    }

    disableRight() {
        const { step, selectedDates, time, monday, tuesday, wednesday, thursday, friday } = this.state;

        if (step === amountOfSteps - 1) {
            return true;
        }
        if (step === 0 && !monday && !tuesday && !wednesday && !thursday && !friday) {
            return true;
        }
        if (step === 1 && selectedDates.length === 0) {
            return true;
        }
        if (step === 2 && !time) {
            return true;
        }
        return false;
    }


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
                this.setState(prevState => ({
                    selectedDates: clone
                }));
            } else {
                this.setState(prevState => ({
                    selectedDates: [...prevState.selectedDates, e]
                }));
            }
        } else {
            this.setState(prevState => ({
                selectedDates: [...prevState.selectedDates, e]
            }));
        }
    }

    handleCreate = () => {
        let rides = [];
        const { fromAddress, toAddress } = this.props.routeInfo;
        const { selectedDates, monday, tuesday, wednesday, thursday, friday, time } = this.state;

        if (monday || tuesday || wednesday || thursday || friday) {
            let today = new Date();
                if (monday) {
                 rides = rides.concat(this.createRecurentRides(1, time, fromAddress, toAddress));
                } else if (tuesday) {
                    rides = rides.concat(this.createRecurentRides(2, time, fromAddress, toAddress));
                } else if (wednesday) {
                    rides = rides.concat(this.createRecurentRides(3, time, fromAddress, toAddress));
                } else if (thursday) {
                    rides = rides.concat(this.createRecurentRides(4, time, fromAddress, toAddress));
                } else if (friday) {
                    rides = rides.concat(this.createRecurentRides(5, time, fromAddress, toAddress));
                }
        }

        this.state.selectedDates.forEach(element => {
            rides.push(this.createRide(fromAddress, toAddress, element, this.state.note));
        });

        this.saveRides(rides);
    };

    createRecurentRides(weekDayIndex, time, fromAddress, toAddress) {
        let rides = [];
        let date = new Date();
        date.setHours(time.hour);
        date.setMinutes(time.minute);

        while (date.getDay() !== weekDayIndex) {
            date.setDate(date.getDate() + 1);
        }

        for (let i = 0; i < 5; i++) {
            rides.push(this.createRide(fromAddress, toAddress, date, this.state.note));
            date.setDate(date.getDate() + 7);
        }
        
if(new Date(rides[0].rideDateTime).getTime() < new Date().getTime()){
    rides = rides.splice(0,1);
}

        return rides;
    }

    createRide(from, to, element, note) {

        const ride = {
            route: {
                FromAddress: {
                    Number: from.number,
                    Street: from.street,
                    City: from.city,
                    Country: "Lithuania",
                    Longitude: from.longitude,
                    Latitude: from.latitude,
                },
                ToAddress: {
                    Number: to.number,
                    Street: to.street,
                    City: to.city,
                    Country: "Lithuania",
                    Longitude: to.longitude,
                    Latitude: to.latitude,
                },
                Geometry: this.props.routeInfo.routeGeometry,
            },
            Note: note,
            rideDateTime:
                element.getFullYear() +
                "-" +
                (element.getMonth() + 1) +
                "-" +
                element.getDate() +
                "  " +
                this.state.time
        };

        return ride;
    }

    saveRides(rides) {
        api.post("Ride", rides).then(res => {
            if (res.status === 200) {
                showSnackBar("Rides successfully created!", 0, this);
                history.push("/driver/rides");
            }
        }).catch((error) => {
            if (error.response && error.response.status === 409) {
                showSnackBar(error.response.data, 2, this)
            }
            else {
                showSnackBar("Failed to create rides", 2, this)
            }
        });
    }

    checkForDateDuplicate = function (needle, haystack) {
        for (let i = 0; i < haystack.length; i++) {
            if (needle.getTime() === haystack[i].getTime()) {
                return true;
            }
        }
        return false;
    };

    render() {
        return (
            <div>
                    <DialogTitle >{this.state.title}</DialogTitle>
                    <Grid container className="scheduler-container">
                        {this.state.step === 0
                            ? <Grid item xs={12} >
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.monday}
                                                onChange={() => this.setState({ monday: !this.state.monday })}
                                                color="primary"
                                            />
                                        }
                                        label="Each monday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.tuesday}
                                                onChange={() => this.setState({ tuesday: !this.state.tuesday })}
                                                color="primary"
                                            />
                                        }
                                        label="Each tuesday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.wednesday}
                                                onChange={() => this.setState({ wednesday: !this.state.wednesday })}
                                                color="primary"
                                            />
                                        }
                                        label="Each wednesday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.thursday}
                                                onChange={() => this.setState({ thursday: !this.state.thursday })}
                                                color="primary"
                                            />
                                        }
                                        label="Each thursday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.friday}
                                                onChange={() => this.setState({ friday: !this.state.friday })}
                                                color="primary"
                                            />
                                        }
                                        label="Each friday"
                                    />
                                </FormGroup>
                            </Grid>
                            : null
                        }
                        {this.state.step === 1
                            ? <Grid item xs={12} >
                                <InfiniteCalendar
                                    onSelect={e => this.handleSelect(e)}
                                    Component={withMultipleDates(Calendar)}
                                    selected={this.state.selectedDates}
                                    interpolateSelection={defaultMultipleDateInterpolation}
                                    width={375}
                                    height={320}
                                    disabledDays={[0, 6]}
                                    minDate={today}
                                    className="calendar"
                                    theme={calendarStyle}
                                />
                            </Grid>
                            : null
                        }
                        {this.state.step === 2
                            ? <Grid item xs={12} style={{marginBottom:"10px"}}>
                                  <TimePicker 
                                  time={this.state.time ? this.state.time.hour + ":" + this.state.time.minute : null}
                                  onTimeChange={(value) => {this.setState({ time: value})}} 
                                  colorPalette="dark" theme="classic"
                                  />

                            </Grid>
                            : null
                        }
                        {this.state.step === 3
                            ? <div>
                                <Grid item xs={12}
                                    className="ride-note-container"
                                >
                                    <TextField
                                        id="outlined-disabled"
                                        multiline
                                        onBlur={(e) => { this.setState({note: e.target.value}) }}
                                        margin="normal"
                                        variant="outlined"
                                        placeholder="Note..."
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className="create-rides-button-container">
                                    <Button
                                        className="generic-colored-btn"
                                        variant="outlined"
                                        onClick={() => {
                                            this.handleCreate();
                                            this.setState({ openDialog: false });
                                        }}
                                    >
                                        Create Rides
                        </Button>
                                </Grid>
                            </div>
                            : null
                        }

                        <RideSchedulerNavigation
                            buttonTitle={this.state.buttonTitle}
                            buttonClick={() => { this.buttonClick() }}
                            showButton={this.state.step === 0 || this.state.step === 1}
                            disableRight={this.disableRight()}
                            disableLeft={this.state.step === 0}
                            navigation={(direction) => { this.navigation(direction) }}
                        />

                    </Grid>
                <SnackBars
                    message={this.state.snackBarMessage}
                    snackBarClicked={this.state.snackBarClicked}
                    variant={this.state.snackBarVariant}

                />
            </div>
        );
    }
}

export default RideScheduler;
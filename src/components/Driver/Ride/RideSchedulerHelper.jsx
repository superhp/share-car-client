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

import "../../../styles/newRideForm.css";
import { calendarStyle } from "../../../utils/calendarStyle";

const today = new Date();
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class RideSchedulerHelper extends React.Component {
    state = {
        open: true,
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return(
            <Dialog
                open={this.state.open}
                onClose={() => this.handleClose()}
                TransitionComponent={Transition}
            >
                <DialogTitle >Schedule Your Rides</DialogTitle>
                <Grid container className="scheduler-container">
                    <Grid item xs={12} >
                        <InfiniteCalendar
                            onSelect={e => this.props.handleSelect(e)}
                            Component={withMultipleDates(Calendar)}
                            selected={this.props.selectedDates}
                            interpolateSelection={defaultMultipleDateInterpolation}
                            width={375}
                            height={380}
                            disabledDays={[0, 6]}
                            minDate={today}
                            className="calendar"
                            theme={calendarStyle}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TimePickers onTimeSet={(value)=>{this.props.handleTime(value)}} />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                                id="outlined-disabled"
                                multiline
                                onBlur={(e) => {this.props.handleNoteChange(e.target.value) }}
                                margin="normal"
                                variant="outlined"
                                placeholder="Leave a note for your passengers"
                                fullWidth
                            />          
                    </Grid>
                    <Grid item xs={12} className="create-rides-button">
                        <Button
                            disabled={this.props.selectedDates.length === 0 ? true : false}
                            variant="outlined"
                            onClick={() => {
                                this.props.handleCreate();
                                this.setState({open: false});
                            }}
                        >
                            Create Rides
                        </Button>
                    </Grid>
                </Grid>
            </Dialog>
        );
    }
}

export default RideSchedulerHelper;
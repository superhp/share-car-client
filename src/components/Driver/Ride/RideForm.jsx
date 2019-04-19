import * as React from "react";
import DateTimePicker from "react-datetime-picker";

import "../../styles/newRideForm.css";
import "../../styles/genericStyles.css";

export const RideForm = (props) => (
    <form className="newRideForm" onSubmit={() => props.handleSubmit()}>
        <div className="form-group">
            <label>From</label>
            <input
                type="search"
                class="form-group"
                id="address-input-from"
                placeholder="Select From Location..."
                defaultValue={
                    !props.addNewForm
                        ? [props.drive.fromNumber, props.drive.fromStreet, props.drive.fromCity, props.drive.fromCountry].join(", ")
                        : ""
                }
            />
        </div>
        <div className="form-group">
            <label>To</label>
                <input
                    type="search"
                    class="form-group"
                    id="address-input-to"
                    placeholder="Select To Location..."
                    defaultValue={
                        !props.addNewForm
                            ? [props.drive.toNumber, props.drive.toStreet, props.drive.toCity, props.drive.toCountry].join(", ")
                            : ""
                    }
                />
        </div>
        <div className="form-group">
            <label>Date and Time:</label>
            <DateTimePicker
                showLeadingZeros={true}
                calendarClassName="dateTimePicker"
                onChange={date => props.handleChange(date)}
                value={props.startDate}
                className="form-group"
            />
        </div>
        <button
            type="submit"
            className="btn btn-primary btn-lg btn-block save-new-ride"
        >
            Save
        </button>
    </form>
);
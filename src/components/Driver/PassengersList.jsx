import * as React from "react";

import "../../styles/passengersList.css";

const PassengersList = props => {
  return (
    <div className="passengersContainer">
      <span class="passengers-badge badge badge-warning">
        Passenger Requests
      </span>
      <ul>
        {props.ridePassengers.map((x, index) => {
          return (
            <div className="passenger">
              <span>
                Passenger:&nbsp;
                {x.passengerFirstName + x.passengerLastName}
              </span>
              <button type="button" class="btn btn-success">
                Accept
              </button>
              <button type="button" class="btn btn-danger">
                Deny
              </button>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
export default PassengersList;

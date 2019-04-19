import React from "react";

import { DriverMap } from "../Driver/DriverMap";
import { PassengerMap } from "../Passenger/PassengerMap";

export default class Map extends React.Component {

  render() {
    
      return this.props.match.params.role === "driver" ? (
        <DriverMap refetch={this.props.refetch}/>
      ) : (
        <PassengerMap refetch={this.props.refetch}/>
      );
    
  }
}

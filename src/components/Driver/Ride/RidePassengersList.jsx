import * as React from "react";
import "../../../styles/genericStyles.css";
import RidePassengerCard from "./RidePassengerCard";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

export class RidePassengersList extends React.Component {
  render() {
    return (
      this.props.passengers != null ? (
        <List>
          {this.props.passengers.length !== 0
            ? this.props.passengers.map((passenger, index) => (
              <ListItem key={index}>
                
                <RidePassengerCard
                  passenger={passenger}
                  route={this.props.route}
                  index={index}
                />
              </ListItem>
            ))
            : <div className="no-requests-div">Ride doesn't have any passengers</div>}
        </List>
      ) : null
    );
  }
}
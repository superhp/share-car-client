import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from "../../../helpers/axiosHelper";
import "../../../styles/genericStyles.css";

class RideCompletedNotification extends React.Component {
    state = {
      open: true,
      ridesId: []
    };
  
    handleClose = () => {
      this.setState({ open: false });
    };

    sendResponse(response, rideId) {
        const passengerResponse = {
            Response: response,
            RideId: rideId
        }
        api.post(`https://localhost:44347/api/Ride/passengerResponse`, passengerResponse);
    }
  
    render() {
      return (
        <div>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Have you participated in these rides?"}</DialogTitle>
            {this.props.rides.filter(x => !this.state.ridesId.includes(x.rideId)).map((ride, i) => 
               <DialogContent key={i}>
                    <DialogContentText id="alert-dialog-description">
                        Driver: {ride.driverFirstName} {ride.driverLastName}
                        <br/>
                        Ride time: {ride.rideDateTime.split("T").join(" ")}
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={() => {
                                if(this.props.rides.length - 1 === this.state.ridesId.length) this.handleClose();
                                this.sendResponse(true, ride.rideId);
                                this.setState({ridesId: [...this.state.ridesId, ride.rideId]});
                            }} 
                            className="ride-completed-notification-button"
                            variant="outlined"
                        >
                            Yes
                        </Button>
                        <Button onClick={() => {
                                if(this.props.rides.length - 1 === this.state.ridesId.length) this.handleClose();
                                this.sendResponse(false, ride.rideId);
                                this.setState({ridesId: [...this.state.ridesId, ride.rideId]});
                            }} 
                            className="ride-completed-notification-button"
                            variant="outlined"
                        >
                            No
                        </Button>
                    </DialogActions>
                </DialogContent> 
            )}
          </Dialog>
        </div>
      );
    }
  }
  
export default RideCompletedNotification;

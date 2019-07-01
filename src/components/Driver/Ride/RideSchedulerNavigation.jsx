import * as React from "react";
import Button from "@material-ui/core/Button";
import "../../../styles/newRideForm.css";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";

class RideSchedulerNavigation extends React.Component {

    navigation(direction) {
        if (direction === 1) {
            if (!this.props.disabledRight) {
                this.props.navigation(1);
            }
        } else {
            if (!this.props.disabledLeft) {
                this.props.navigation(-1);
            }
        }
    }

    render() {
        return (

            <div className="scheduler-button-container">
                {this.props.showButton
                    ? <Button
                        variant="contained"
                        className="generic-colored-btn"
                        onClick={() => { this.props.buttonClick() }}>
                        {this.props.buttonTitle}
                    </Button>
                    : <div></div>
                }
                <div>
                    <div className="navigation-button-container">

                        <div
                            className={this.props.disableLeft ? "generic-button disabled" : "generic-button"}
                            onClick={() => { this.navigation(-1) }}>


                            <ChevronLeft />
                        </div>
                        <div
                            className={this.props.disableRight ? "generic-button disabled" : "generic-button"}
                            onClick={() => { this.navigation(1) }}>

                            <ChevronRight />
                        </div>
                    </div >
                </div>
            </div>

        );
    }
}

export default RideSchedulerNavigation;
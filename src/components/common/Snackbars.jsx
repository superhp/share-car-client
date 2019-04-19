import React from "react";
import PropTypes from "prop-types";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";

import SnackbarsContent from "./SnackbarContent";
import { snackbarMargin } from "../../utils/snackbarStyles";

class Snackbars extends React.Component {
  state = {
    open: false
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  };

  render() {

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.props.snackBarClicked}
          autoHideDuration={6000}
          onClose={(e, r) => this.handleClose(e, r)}
        >
          <SnackbarsContent
            onClose={(e, r) => this.handleClose(e, r)}
            variant={this.props.variant}
            message={this.props.message}
          />
        </Snackbar>
      </div>
    );
  }
}

Snackbars.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(snackbarMargin)(Snackbars);

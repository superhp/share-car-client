import * as React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

import { snackbarStyles, variantIcon } from "../../utils/snackbarStyles";

class SnackbarsContent extends React.Component {
    
    render() {
    const { classes, className, message, onClose, variant, ...other } = this.props;
    const Icon = variantIcon[variant];
    return (
        <SnackbarContent
          className={classNames(classes[variant], className)}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classNames(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={onClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>
          ]}
          {...other}
        />
    );
  }
}

SnackbarsContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired
};

export default withStyles(snackbarStyles)(SnackbarsContent);
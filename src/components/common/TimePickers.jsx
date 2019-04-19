import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import "../../styles/newRideForm.css";
var time = null;

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
});

function TimePickers(props) {
  const { classes } = props;
  return (
    <form className={classes.container} noValidate>
      <TextField
        id="time"
        label="Select default time of rides"
        type="time"
        onBlur={e => {
          props.onTimeSet(e.target.value);
        }}
        defaultValue="07:00"
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
        inputProps={{
          step: 300 // 5 min
        }}
      />
    </form>
  );
}

TimePickers.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TimePickers);

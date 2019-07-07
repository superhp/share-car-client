import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import 'react-times/css/classic/default.css';
// pick a date util library
import TimePicker from 'react-times';
import "../../styles/newRideForm.css";
var time = null;
/*export const defaultTime = "08:00";
const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  }
});
*//*
function TimePickers(props) {
  const { classes, title, defaultValue } = props;
  return (
    <form className={classes.container} noValidate>
      {/*<TextField
        id="time"
        label={title}
        type="time"
        ampm={true}
        onChange={e => {
          props.onChange(e.target.value);
        }}
        defaultValue={defaultValue}
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
        inputProps={{
          step: 300 // 5 min
        }}
      />

<TimePicker
        clearable
        ampm={false}
        label="24 hours"
        value={() => {}}
        onChange={() => {}}
      />

    </form>
  );
}

TimePickers.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TimePickers);



*/

export default class TimePickers extends React.Component<{}> {


  render() {
      return (
  <TimePicker colorPalette="dark" theme="classic"/>

      )}
}
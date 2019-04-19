import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { withStyles } from "@material-ui/core/styles";

import { OfficeAddresses } from "../../utils/AddressData";

const styles = theme => ({
  root: {
    display: "flex"
  },
  paper: {
    marginRight: theme.spacing.unit * 2
  }
});

class SimpleMenu extends React.Component {
  state = {
    open: false,
    address: OfficeAddresses[0].street + OfficeAddresses[0].number,
    index: 0
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = (event, index) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    if(!index){
      this.setState({open:false});
      this.props.handleSelection(OfficeAddresses[this.state.index]);
      return;
    }
    this.setState({ open: false, address: OfficeAddresses[index].street + OfficeAddresses[index].number, index:index });
    this.props.handleSelection(OfficeAddresses[index]);
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <div>
          <Button
            variant="contained"
            className="select-office-menu"
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
          {this.state.address}
          </Button>
          <Popper
            className="list-of-items"
            open={open}
            style={{ zIndex: 999999 }}
            anchorEl={this.anchorEl}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ zIndex: 999999 }}
              >
                <Paper style={{ zIndex: 999999 }}>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList style={{ zIndex: 999999 }}>
                      {OfficeAddresses.map((element, index) => (
                        <MenuItem
                          key={index}
                          style={{ zIndex: 999999 }}
                          onClick={e => this.handleClose(e, index)}
                        >
                          {element.number} {element.street} {element.city}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
}

SimpleMenu.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleMenu);

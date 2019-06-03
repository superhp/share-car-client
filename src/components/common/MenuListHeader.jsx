import * as React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import "../../styles/MenuHeader.css";

class MenuListHeader extends React.Component {
  state = {
    anchorEl: null
  };
  constructor(props) {
    super(props);
    this.setState({ anchorEl: null });
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.logOut = this.logOut.bind(this);
  }
  handleClick(event) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }
  logOut() {
    this.setState({ anchorEl: null });
    this.props.logout();
  }

  render() {
    const image =
      this.props.user !== null && this.props.user.pictureUrl !== null ? (
        <div>
          {this.props.user.firstName}
          <img className="thumbnail" src={this.props.user.pictureUrl} alt="" />
        </div>
      ) : (
        <AccountCircleIcon />
      );

    return (
      <div className="menu-list-header">
        <Button
          className="header-button"
          aria-owns={this.state.anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <AccountCircleIcon />
        </Button>

        <Popper
          placement="top-end"
          className="menu-header-popper"
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center bottom" : "center bottom"
              }}
            >
              <Paper id="menu-list-grow">
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    <MenuItem
                      component={Link}
                      to={
                        this.props.isDriver
                          ? "/driver/profile"
                          : "/passenger/profile"
                      }
                      onClick={this.handleClose}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem onClick={this.logOut}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

export default MenuListHeader;

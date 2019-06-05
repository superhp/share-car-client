import * as React from "react";
import { Link } from "react-router-dom";
import Map from "@material-ui/icons/Map";
import NoteAdd from "@material-ui/icons/NoteAdd";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";
import Cached from "@material-ui/icons/Cached";
import Book from "@material-ui/icons/Book";

import "../../styles/navbar.css";
import Media from "react-media";

const NavBar = props => {
  const status = props.isDriver ? "/driver" : "/passenger";
  return (
    <div className="navBar">
      <Link className="navBar-button" role="button" to={status + "/map"}>
        <div className="button-container">
          <Map />
          
          <div className="">Map</div>
        </div>
      </Link>
      <Link
        className="navBar-button"
        role="button"
        to={status + (!props.isDriver ? "/requests" : "/rides")}
      >
        <div className="button-container">
          <NoteAdd />
          
          <div className="">{!props.isDriver ? "My Requests" : "My Rides"}</div>
        </div>
      </Link>
    </div>
  );
};
export default NavBar;

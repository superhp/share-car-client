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
          <Media query="(min-width: 714px)">
            {matches => (matches ? <div className="">Routes map</div> : "")}
          </Media>
        </div>
      </Link>
      <Link
        className="navBar-button"
        role="button"
        to={status + (!props.isDriver ? "/requests" : "/rides")}
      >
        <div className="button-container">
          <NoteAdd />
          <Media query="(min-width: 714px)">
            {matches =>
              matches ? (
                <div className="">{!props.isDriver ? "Requests" : "Rides"}</div>
              ) : (
                ""
              )
            }
          </Media>
        </div>
      </Link>
    </div>
  );
};
export default NavBar;

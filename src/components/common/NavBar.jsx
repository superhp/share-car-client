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
      <Link className="navBar-button" role="button" to={status + "/Map"}>
        <div className="button-container">
          <Map />
          <Media query="(min-width: 714px)">
            {matches => matches ? 
              <div className="button-container">Routes map</div>
            : ""}
          </Media>
        </div>
      </Link>
      {!props.isDriver ? (
        <Link className="navBar-button" role="button" to={status + "/Requests"}>
          <div className="button-container">
            <NoteAdd />
            <Media query="(min-width: 714px)">
              {matches => matches ? 
                <div className="button-container">Requests</div>
              : ""}
            </Media>
          </div>
        </Link>
      ) : (
        <Link className="navBar-button" role="button" to={status + "/rides"}>
          <div className="button-container">
            <PlaylistAdd />
            <Media query="(min-width: 714px)">
              {matches => matches ? 
                <div className="button-container">Rides</div>
              : ""}
            </Media>
          </div>
        </Link>
      )}
      <Link className="navBar-button" role="button" to="/">
        <div className="button-container">
          <Cached />
          <Media query="(min-width: 714px)">
              {matches => matches ? 
                <div className="button-container">Change role</div>
              : ""}
          </Media>
        </div>
      </Link>
      <Link className="navBar-button" role="button" to={status + "/Manual"}>
        <div className="button-container">
          <Book />
          <Media query="(min-width: 714px)">
              {matches => matches ? 
                <div className="button-container">Manual</div>
              : ""}
          </Media>
        </div>
      </Link>
    </div>
  );
};
export default NavBar;

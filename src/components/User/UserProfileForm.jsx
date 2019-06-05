import * as React from "react";

import { UserPoints } from "./UserPoints";
import { UserProfileFormField } from "./UserProfileFormField";
import Button from "@material-ui/core/Button";

import "../../styles/userProfile.css";

export const UserProfileForm = (props) => (
    <div className="container-fluid">
        <div className="container profile-container">
          <form className="profile-form col-sm-6">
            <img className="thumbnail" src={props.user.pictureUrl} alt="" />
            <UserProfileFormField 
                displayName="Your Email"
                disabled={true}
                name="email"
                type="email"
                value={props.user.email ? props.user.email : ""}
            />
            <UserProfileFormField 
                displayName="First name"
                name="name"
                type="text"
                value={props.user.firstName ? props.user.firstName : ""}
                onChange={e => props.onNameChange(e)}
            />
            <UserProfileFormField 
                displayName="Last name"
                name="surname"
                type="text"
                value={props.user.lastName ? props.user.lastName : ""}
                onChange={e => props.onSurnameChange(e)}
            />
            <UserProfileFormField 
                displayName="Phone number"
                name="phone"
                type="text"
                value={props.user.phone ? props.user.phone : ""}
                onChange={e => props.onPhoneChange(e)}
            />
            <UserProfileFormField 
                displayName="License plate number"
                name="license"
                type="text"
                value={props.user.licensePlate ? props.user.licensePlate : ""}
                onChange={e => props.onLicenseChange(e)}
            />
                        <UserProfileFormField 
                displayName="Number of seats"
                name="seats"
                type="text"
                value={props.user.numberOfSeats ? props.user.numberOfSeats : ""}
                onChange={e => props.onNumberOfSeatsChanged(e)}
            />
                        <UserProfileFormField 
                displayName="Car model"
                name="model"
                type="text"
                value={props.user.carModel ? props.user.carModel : ""}
                onChange={e => props.onCarModelChanged(e)}
            />
                        <UserProfileFormField 
                displayName="Car color"
                name="color"
                type="text"
                value={props.user.carColor ? props.user.carColor : ""}
                onChange={e => props.onCarColorChanged(e)}
            />
            <Button
              onClick={e => props.onButtonClick(e)}
              variant="contained"
              className="profile-save-button"
            >
              Save
            </Button>
          </form>
          <UserPoints 
            pointCount={props.points}
            role={props.role}
          />
        </div>
    </div>
);
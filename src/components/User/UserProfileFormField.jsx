import * as React from "react";

import "../../styles/userProfile.css";

export const UserProfileFormField = (props) => (
    <div className="form-group">
        <label className="form-header">
            {props.displayName}
        </label>
        <input
            type={props.type}
            name={props.name}
            disabled={props.disabled}
            className="form-control form-header"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={props.value}
            onChange={e => props.onChange(e)}
        />
    </div>
);
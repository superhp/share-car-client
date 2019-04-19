import * as React from "react";

let role = "";

export const RoleContext = React.createContext({
    role: role,
    changeRole: (newRole) => {
        role = newRole;
    }
});
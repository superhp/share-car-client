// @flow
import api from "../helpers/axiosHelper";

class UserService {
  getLoggedInUser = (callback: UserProfileData => void) => {
    api.get("user")
      .then(response => {
        callback((response.data: UserProfileData));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  updateUserProfile = (accessToken: AccessToken, callback: () => void) => {
    api.post("authentication/facebook", {
        accessToken: accessToken
      })
      .then(response => {
        if (response.status === 200) callback();
      })
      .catch((error) => {
        console.error(error);
      });
  };
}

export default UserService;

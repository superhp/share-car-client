// @flow
import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from 'react-google-login';
import CognizantEmail from "../Verification/CognizantEmail";
import VerificationCode from "../Verification/VerificationCode";
import history from "../../helpers/history";
import AuthenticationService from "../../services/authenticationService";
import "../../styles/login.css";
import logo from '../../images/shareCarLogo.png';
import SnackBars from "../common/Snackbars";
import { SnackbarVariants, showSnackBar } from "../../utils/SnackBarUtils"

class Login extends Component<{}> {
  authService: AuthenticationService = new AuthenticationService();
  constructor(props) {
    super(props);
    this.buttomRef = React.createRef();
  }
  state: any = {
    unauthorized: false,
    verificationCodeSent: false,
    facebookEmail: null,
    googleEmail: null,
    snackBarClicked: false,
    snackBarMessage: null,
    snackBarVariant: null
  }

  responseFacebook = (response: any) => {

    this.setState({
      facebookEmail: response.email,
      googleEmail: null,

    });

    this.authService.loginWithFacebook(
      response.accessToken,
      this.userAuthenticated,
      this.userUnauthorized
    );
  };
  responseGoogle = (response: any) => {
    var profileObj = {
      email: response.profileObj.email,
      givenName: response.profileObj.givenName,
      familyName: response.profileObj.familyName,
      imageUrl: response.profileObj.imageUrl
    }
    this.setState({ googleEmail: response.profileObj.email, facebookEmail: null });

    this.authService.loginWithGoogle(
      profileObj,
      this.userAuthenticated,
      this.userUnauthorized);
  };

  displayVerificationCodeComponent = () => {
    this.setState({ submitCode: true });
  };

  userAuthenticated = () => {
    history.push("/");
  };

  userUnauthorized = () => {
    this.setState({ submitEmail: true, submitCode: false },() => {
      this.buttomRef.current.scrollIntoView({block: 'end', behavior: 'smooth'});
    });
  };

  render() {
    return (
      <div className="login-container">
        <img className="login-image" src={logo} alt="" />
        <h1>ShareCar Login</h1>
        <div className="login-buttons-container">
          <FacebookLogin
              appId="2371871473042404"
              fields="name,email,picture"
              callback={this.responseFacebook}
              cssClass="facebook-login-button"
          />
          <GoogleLogin
              clientId="875441727934-b39rfvblph43cr5u9blmp4cafbnqcr9k.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={this.responseGoogle}
            />
        </div>
        {
          this.state.submitEmail ? (
            this.state.submitCode
              ? <VerificationCode
                facebookEmail={this.state.facebookEmail} googleEmail={this.state.googleEmail}
                showSnackBar={(message, variant) => { showSnackBar(message, variant, this) }}
              />

              : <CognizantEmail
                facebookEmail={this.state.facebookEmail}
                googleEmail={this.state.googleEmail}
                emailSubmited={this.displayVerificationCodeComponent}
                showSnackBar={(message, variant) => { showSnackBar(message, variant, this) }}
              />
          )
            :
            <div></div>
        }
        <div ref={this.buttomRef}></div>
        <SnackBars
          message={this.state.snackBarMessage}
          snackBarClicked={this.state.snackBarClicked}
          variant={this.state.snackBarVariant}
        />
      </div>
    );
  }
}

export default Login;

// @flow
import React, { Component } from "react";
import api from "../../helpers/axiosHelper";
import history from "../../helpers/history";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "../../styles/login.css";

class VerificationCode extends Component {

  submitCode() {
    const code = document.getElementById("verification-code").value;
    const objectToSend = {
      VerificationCode: code,
      FacebookEmail: this.props.facebookEmail,
      GoogleEmail: this.props.googleEmail
    };

    api.post("authentication/VerificationCodeSubmit", objectToSend)
    .then((response) => {
      if (response.status === 200) {
        history.push("/");
      }
    }).catch((error) => {
      if (error.response.status === 401) {
        this.props.showSnackBar("Incorrect code.", 2);
      } else {
        this.props.showSnackBar("Something went wrong", 2);
      }
    })
  }

  render() {
    return (
      <div className="code-submit">
        <Card className="login-card">
          <CardContent>
            <span>Submit your verification code</span>
            <div className="code-input">
              <Grid container justify="flex-start">
                <TextField
                  id="verification-code"
                  label="Your verification code"
                  className="verification-code-field"
                  margin="dense"
                />
                <Button 
                  className="button-submit"
                  variant="outlined"
                  color="primary"
                  onClick={() => this.submitCode()}
                >
                  Submit code
                </Button>
              </Grid>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default VerificationCode;
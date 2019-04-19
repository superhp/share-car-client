// @flow
import React, { Component } from "react";
import api from "../../helpers/axiosHelper";
import GDPRAgreement from "../GDPRAgreement";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import "../../styles/login.css";
import { Card, CardContent } from "@material-ui/core";

class CognizantEmail extends Component {

state={
  disabled : true
}
onCheckBoxClick = () =>{
  this.setState({disabled : !this.state.disabled})
}
  submitEmail() {
    const email = document.getElementById("email").value;

    if (!email ||
      email.length <= 14 ||
      email.substring(email.length - 14) !== "@cognizant.com") {

      alert("Only Cognizant emails are allowed");

    } else {

      const objectToSend = {
        FacebookEmail: this.props.facebookEmail,
        GoogleEmail: this.props.googleEmail,
        CognizantEmail: email,
      };

      api.post("authentication/CognizantEmailSubmit", objectToSend)
        .then((response) => {
          if (response.status === 200) {
            this.props.showSnackBar("Email submited", 0);
            this.props.emailSubmited();
          }
        }).catch((error) => {
          if (error.response.status === 401) {
            alert("Only Cognizant emails are allowed");
            this.props.showSnackBar("Email submited", 0);

          } else {
            if (error.response.status === 400 && error.response.data) {
              this.props.showSnackBar("Only Cognizant emails are allowed", 2);

            } else {
              this.props.showSnackBar("Something went wrong", 2);
            }
          }
        })
    }
  }

  render() {
    return (
      <div className="email-submit">
        <Card className="login-card">
          <CardContent>
            <span>Submit your cognizant email to receive verification code</span>
            <div className="email-input">
              <Grid container justify="flex-start">
                <TextField
                  id="email"
                  label="Your email"
                  className="email-input-field"
                  margin="dense"
                />
                <Button 
                  className="button-submit"
                  variant="contained"
                  disabled = {this.state.disabled}
                  onClick={() => this.submitEmail()}
                >
                  Get code
                </Button>
              </Grid>
              <GDPRAgreement checkBoxClick = {this.onCheckBoxClick}/>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default CognizantEmail;

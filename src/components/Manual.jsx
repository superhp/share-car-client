import * as React from "react";
import Grid from "@material-ui/core/Grid";

import "../styles/genericStyles.css";

const Manual = props => {
  return (
    <Grid className="manual">
      <h3 className="manual-heading"> Login </h3>
      <p>
        In order to use an application you need to login with Facebook or Google account.
        If it is your first time logging in, you will be asked to submit your Cognizant email
        in order to send you verification code and be certain, that you are an employee of Cognizant.
        If you loggin with both Facebook and Google accounts, you will still have one account in this application
      </p>

      <p>
        Once you loggin to application with Facebook or Google accout, you will also loggin to Facebook or Google in browser.
        Loggin out from Facebook or Google won't log you out from appication and vice versa. It is worth to mention that
        if somebody else want's to loggin to Share car on browser, where you are logged in, you will have to logout from both application and Facebook and/or Google,
        because application automatically load user Facebook/Google user, which is logged in in a browser.
      </p>

      <h3 className="manual-heading"> Role selection </h3>
      <p>
        Once you have logged in, choose your role. If you want to someone to pick you up - choose passenger,
        if you want to drive other people to office - choose driver. You will be able to change a this role anytime.
      </p>

      <h3 className="manual-heading"> Upper navigation bar </h3>

      <p>
        Independentlly from the role ypou choose, you will always see same upper navigation bar.
        Here you can logout, navigate to you profile or reload data displayed in application.
      </p>

      <h3 className="manual-heading"> Driver</h3>

      <p>
        If you choose to be a driver, available actions are displayed in lower navigation bar.
        These are the following:
        Routes map - creation of rides.
        Rides - list of already created rides and all information related to them.
      </p>

      <h5> Routes map</h5>

      <p>
        In order to create rides, you have to mark your route. You can do this by clicking on a map, or writing address in an empty input field on aleft side.
        Keep in mind that choosing only start and end points may not create same route your are taking. In this case it is recommened to choose several route points.
        Each route point can be deleted or modified, but modification is possible only by changing address in an input field.
      </p>
      <p>
        You can also set your trip direction (to/from office) and an office address.
        Each trip must start or end at the Cognizant office.
      </p>
      <p>
        Once you have marked your route, click <span style={{color: "#3581b8"}}>CONTINUE</span> button in lower right corner.
        Now you see a pop up window, where you can mark days and time of your rides.
      </p>

      <h5> Rides</h5>

      <p>
        Here you can see a list of your rides. Detailed informatiuon about ride can be viewed by clicking <span style={{color: "#3581b8"}}>VIEW</span> button, ride is <span style={{color: "#3581b8"}}>DELETED</span> by clicking <span style={{color: "#3581b8"}}>DELETE</span> button.
        If you choose to delete button, each person who requested or was allready approved as a passenger of a ride will be notified. 
      </p>

      <p>
        Detailed information consists of ride requests and passengers.
        You can view desired pick up point of a person requesting ride by clicking <span style={{color: "#3581b8"}}>SHOW ON MAP</span>.
        Once you accept request, person is added to list of passengers.
      </p>

      <h3 className="manual-heading"> Passenger</h3>

      <p>
        If ypu choose to be a passenger, available actions are displayed in lower navigation bar.
        These are the following:
        Routes map - view of existing routes and rides.
        Requests - list of your ride requests.
      </p>

      <h5> Routes map</h5>

      <p>
        Here you see all routes which satisfies your filtering criteria (office selection and route direction).
        If you don't see any routes on map, it means that routes to/from selected office don't exists.
        If there are more than one route to/from selected office, you can navigate by clicking <span style={{color: "#3581b8"}}>NEXT/PREVIOUS ROUTE</span> (only one route will be displayed at the time).
      </p>
      <p>
        Choose desired pick up point by clicking on map or writing an address in an input field right above route filter parameters selction window.
        You won't be able to request ride until you choose pick up point.
      </p>
      <p>
        By clicking <span style={{color: "#3581b8"}}>SHOW DRIVERS</span> button you can see list of of available rides. Click <span style={{color: "#3581b8"}}>REGISTER</span> to send request to driver of desired ride.
      </p>


      <h5> Requests</h5>

      <p>
        Here you can see a list of your requests and their statuses.
        If driver responded to your request or deleted requested ride (independentlly from request status) you will see an icon next to the request.
        Also youu can view route of requested ride and you pick up point by clicking <span style={{color: "#3581b8"}}>SHOW ON MAP</span>
      </p>
    </Grid>
  );
};
export default Manual;

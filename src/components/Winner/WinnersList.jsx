import * as React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import "typeface-roboto";

import "../../styles/driversRidesList.css";
import "../../styles/genericStyles.css";
import "../../styles/driversRidesList.css";

export class WinnersList extends React.Component {
  render() {
    return (
      <Grid container justify="center">
        {this.props.winnersList.length > 0 ? this.props.winnersList.map((winner, index) => (
          <Grid item xs={12} key={index}>
            <Card className="rides-card generic-card">
              <CardActions>
                <Grid container>
                  <CardContent className="winner-mapping">
                    <Typography variant="headline" component="p">
                      {winner.firstName} {winner.lastName}
                    </Typography>
                    <Typography variant="display1" className="winner-points">
                      {this.props.pointsList[index]} pts
                    </Typography>
                  </CardContent>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        ))
        : <h4 style={{marginTop: "10px"}}>There were no rides this month</h4>}
      </Grid>
    );
  }
}

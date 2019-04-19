import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import "typeface-roboto";

import { WinnersList } from "./WinnersList";
import api from "../../helpers/axiosHelper";

import "../../styles/genericStyles.css";
import "../../styles/winnerBoard.css";

export class WinnerBoard extends React.Component {
  state = {
    winners: [],
    points: []
  };
  componentDidMount() {
    this.showWinnersBoard();
  }

  componentWillReceiveProps(nextProps){
    this.showWinnersBoard();
  }

  showWinnersBoard() {
    api.get("user/WinnerBoard")
      .then(response => {
        if (response.status === 200) {
          this.setState({ winners:  response.data.users, points:  response.data.points });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    return (
        <Grid container className="winner-board">
          <Grid item xs={12}>
            <Grid container justify="center">
              <Typography
                variant="display1"
                className="winner-container"
              >
                TOP 5
              </Typography>
            </Grid>
          </Grid>
        <WinnersList
          winnersList={this.state.winners}
          pointsList={this.state.points}
        />
      </Grid>
    );
  }
}
export default WinnerBoard;

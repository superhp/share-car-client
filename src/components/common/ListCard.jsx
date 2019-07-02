import * as React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import DeleteIcon from "@material-ui/icons/Delete";
import Close from "@material-ui/icons/Close";
import InfoIcon from "@material-ui/icons/Info";
import "typeface-roboto";
import "../../styles/listCard.css";
import "../../styles/genericStyles.css";

export default class ListCard extends React.Component {

  render() {
    return (
      <Grid key={this.props.index} item xs={12}>
        <Card className="generic-card">

          <Grid container className="list-card-container">

            <Grid item xs={8}>
              {this.props.new
                ? <Badge
                  className="card-badge"
                  badgeContent={"new"}
                  color="primary"
                  children={""}
                ></Badge>
                : null
              }
              <CardContent >
                <Typography className="generic-color" component="p">
                  {this.props.firstText}
                </Typography>
                <Typography className="generic-color" component="p">
                  {this.props.secondText}
                </Typography>
                <Typography color="textPrimary">
                  {this.props.thirdText}
                </Typography>
              </CardContent>
            </Grid>
            <Grid item xs={3} className="card-button-container">
           <div>
              {this.props.newView ?

                <Badge
                  className="view-badge"
                  badgeContent={"new"}
                  color="primary"
                  children={""}
                />
                : null}
              <Button
                onClick={() => {
                  this.props.viewed()
                }}
                variant="contained"
                size="small"
                className="generic-colored-btn"
              >
                View
                          <InfoIcon />
              </Button>
              </div>
            </Grid>
            <Grid  item xs={1}>
              {this.props.disabled
                ? <div></div>
                : <div className="delete-item-container">
                  <div>
                    <DeleteIcon onClick={() => this.props.deleted()} className="clickable" />
                  </div>
                  <div>
                    <input onChange={(e) => { this.props.selected(e) }} className="select-item" type="checkbox" />
                  </div>
                </div>
              }

            </Grid>
          </Grid>
        </Card>
      </Grid>
    );
  }
}

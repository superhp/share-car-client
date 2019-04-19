import * as React from "react";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import "../../styles/winnerBoard.css";

export const UserPoints = (props) => (
    <Grid container alignItems="center" direction="row" justify="center">
        <Grid item xs={12}>
            <Card>
                <CardContent className="points-card">
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justify="center"
                    >
                        <Grid item xs={12}>
                            <Typography variant="title">
                                Your points this month
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify="center">
                                <Typography
                                justify="center"
                                variant="display1"
                                color="textPrimary"
                                >
                                {props.pointCount ? props.pointCount : "0"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions className="button-card">
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justify="center"
                    >
                        <Link
                            to={"/" + props.role + "/winnerBoard"}
                            className="winner-board-link"
                        >
                            <Grid
                                container
                                alignItems="center"
                                direction="row"
                                justify="center"
                            >
                                <Button
                                variant="contained"
                                color="primary"
                                className="generic-container-color"
                                >
                                Winner Board
                                </Button>
                            </Grid>
                        </Link>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
    </Grid>
);
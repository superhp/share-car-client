import * as React from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import "../../styles/genericStyles.css"

export default class MultiselectButtons extends React.Component {


  render() {
    return (
                <Card className="generic-card">
                  <div>
                    <Button
                      onClick={() => this.props.selectAll()}
                      variant="contained"
                      size="small"
                      className="generic-colored-btn"
                    >
                      Select all
                  </Button>
                    <Button
                      onClick={() => this.props.deselectAll()}
                      variant="contained"
                      size="small"
                      className="generic-colored-btn"
                    >
                      Deselect all
                  </Button>
                  </div>
                </Card>
    );
  }
}

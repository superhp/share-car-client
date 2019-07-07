import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import "../../styles/genericStyles.css";
import Map from "@material-ui/icons/Map";
import NoteAdd from "@material-ui/icons/NoteAdd";
import Close from "@material-ui/icons/Close";
import { Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = {
    root: {
        overflow: 'visible',
    },
    paper: {
        overflow: 'visible !important',
        margin: '13px !important'
    }
}

class GenericDialog extends React.Component {
    state = {
        content: this.props.content
    }
    render() {
        return (

            <Dialog className="dialog-body" classes={{paper:'style: "overflow:visible"'}} onClose={() => this.props.close()} open={this.props.open}>
                <div>
                    <Close onClick={() => this.props.close()} className={this.props.white ? "dialog-close-white" : "dialog-close-black"} />
                </div>
                <DialogContent className="dialog-content">
                    {this.props.content}

                </DialogContent>
            </Dialog>
        )
    }
}
export default withStyles(styles)(GenericDialog);

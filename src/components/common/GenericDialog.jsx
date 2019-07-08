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

class GenericDialog extends React.Component {

    render() {
        return (
            <div>
                {
                    this.props.visibleOverflow
                        ? <style dangerouslySetInnerHTML={{ __html: `.MuiPaper-root-107 { overflow: visible !important;}` }} />
                        : null
                }
                <Dialog className="dialog-body" onClose={() => this.props.close()} open={this.props.open}>
                    <div>
                        <Close onClick={() => this.props.close()} className={this.props.white ? "dialog-close-white" : "dialog-close-black"} />
                    </div>
                    <DialogContent className={this.props.overflowX ? "dialog-content-x" : "dialog-content"}>
                        {this.props.content}

                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}
export default GenericDialog;

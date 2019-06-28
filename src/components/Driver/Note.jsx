import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "../../styles/note.css"
import "../../styles/genericStyles.css"

export class Note extends React.Component {

    state = {
        editing: false,
        value: this.props.note ? this.props.note : "",
    }

    render() {
        return (
            <div
                className="note-container"
            >
                <div>
                    <TextField
                        className="note"
                        disabled = {this.props.disabled}
                        margin="normal"
                        onBlur={() => {this.props.updateNote(this.state.value)}}
                        multiline
                        fullWidth
                        variant="outlined"
                        value={this.state.value}
                        onChange={(e) => { this.setState({ temporaryValue: e.target.value}) }}
                    />
                </div>
            </div>
        );
    }
}
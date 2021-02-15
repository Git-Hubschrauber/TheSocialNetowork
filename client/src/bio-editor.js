import axios from "./axios";
import React from "react";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            editingMode: false,
            noBioInfo: false,
        };
    }

    toggleEditingMode() {
        console.log(" toggleEditingMode clicked: ", this.editingMode);
        this.setState({ editingMode: !this.state.editingMode });
    }

    submitBio() {
        console.log("submit clicked", this.state.bio);
        const userInput = this.state;
        axios
            .post("/editBio", userInput)
            .then((resp) => {
                console.log("resp from server: ", resp);
                let error = resp.data.error;
                if (error) {
                    console.log("error from server");
                    this.setState({
                        error: true,
                        noBioInfo: true,
                    });
                } else {
                    console.log("resp from server no error: ", resp.data);
                    this.toggleEditingMode();
                    const newProps = resp.data;
                    this.props.componentDidUpdate2(newProps);
                }
            })
            .catch((err) => {
                console.log("error in editBio: ", err);
            });
    }

    changeHandler(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },

            () => console.log("this.state: ", this.state)
        );
    }

    render() {
        if (this.state.editingMode) {
            return (
                <div>
                    <h1>Please edit your bio</h1>

                    <div>
                        <label>About yourself:</label>
                        <textarea
                            onChange={(e) => this.changeHandler(e)}
                            name="bio"
                            defaultValue={this.props.bio}
                        ></textarea>

                        <button onClick={() => this.submitBio()}>Save</button>
                    </div>
                    <button onClick={() => this.toggleEditingMode()}>
                        Cancel
                    </button>
                </div>
            );
        }
        if (this.props.noBioInfo) {
            return (
                <button onClick={() => this.toggleEditingMode()}>
                    Add your bio to the profile
                </button>
            );
        }
        return (
            <div>
                <h1>Your Bio</h1>

                <div>About yourself: {this.props.bio}</div>

                <button onClick={() => this.toggleEditingMode()}>
                    Change your bio!
                </button>
            </div>
        );
    }
}

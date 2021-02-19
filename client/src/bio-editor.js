import React from "react";
import axios from "./axios";

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
                <div className="ownProfileBio">
                    <h1 className="pleaseEdit">Please edit your bio</h1>

                    <div>
                        <label>About yourself:</label>
                        <textarea
                            onChange={(e) => this.changeHandler(e)}
                            name="bio"
                            defaultValue={this.props.bio}
                        ></textarea>

                        <button
                            className="submitBioBtn"
                            onClick={() => this.submitBio()}
                        >
                            Save
                        </button>
                    </div>
                    <button
                        className="cancelSubmitBioBtn"
                        onClick={() => this.toggleEditingMode()}
                    >
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
            <div className="ownProfileBio">
                <h2>About yourself:</h2>
                <p>{this.props.bio}</p>
                <button
                    className="changeBioBtn"
                    onClick={() => this.toggleEditingMode()}
                >
                    Change your bio!
                </button>
            </div>
        );
    }
}

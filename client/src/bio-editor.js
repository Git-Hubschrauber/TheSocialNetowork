import axios from "./axios";
import React from "react";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            editingMode: false,
            // age: "",
            // gender: "",
            // hobbies: "",
            // biotext: "",
        };
    }

    toggleEditingMode() {
        console.log(" toggleEditingMode clicked: ", this.editingMode);
        this.setState({ editingMode: !this.state.editingMode });
    }

    // componentDidUpdate(newProps) {
    //     if (
    //         this.state.age !== newProps.age ||
    //         this.state.gender !== newProps.gender ||
    //         this.state.hobbies !== newProps.hobbies ||
    //         this.state.biotext !== newProps.biotext
    //     ) {
    //         console.log("profile data changed: ", newProps);
    //         this.setState({
    //             age: newProps.age,
    //             gender: newProps.gender,
    //             hobbies: newProps.hobbies,
    //             biotext: newProps.biotext,
    //         });
    //     }
    // }

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
                    });
                } else {
                    console.log("resp from server no error: ", resp.data);
                    this.toggleEditingMode();
                    const newProps = resp.data;
                    this.props.componentDidUpdate2(newProps);
                    // this.setState({
                    //     noBioInfo: false,
                    //     age: newProps.age,
                    //     gender: newProps.gender,
                    //     hobbies: newProps.hobbies,
                    //     biotext: newProps.biotext,
                    // });
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
                        <label>
                            Age:{" "}
                            <input
                                onChange={(e) => this.changeHandler(e)}
                                type="number"
                                name="age"
                            ></input>
                        </label>

                        <label>
                            Sex:
                            <label>
                                male:
                                <input
                                    onChange={(e) => this.changeHandler(e)}
                                    type="radio"
                                    name="gender"
                                    id="male"
                                    value="male"
                                />
                            </label>
                            <label>
                                female:
                                <input
                                    onChange={(e) => this.changeHandler(e)}
                                    type="radio"
                                    name="gender"
                                    id="female"
                                    value="female"
                                />
                            </label>
                            <label>
                                other:
                                <input
                                    onChange={(e) => this.changeHandler(e)}
                                    type="radio"
                                    name="gender"
                                    id="other"
                                    value="other"
                                />
                            </label>
                        </label>

                        <label>
                            Hobbies:
                            <input
                                onChange={(e) => this.changeHandler(e)}
                                type="text"
                                name="hobbies"
                            ></input>
                        </label>

                        <label>About yourself:</label>
                        <textarea
                            onChange={(e) => this.changeHandler(e)}
                            name="biotext"
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
                <div>Age: {this.props.age}</div>
                <div>Sex: {this.props.gender}</div>

                <div>Hoobies: {this.props.hobbies}</div>
                <div>About yourself: {this.props.biotext}</div>

                <button onClick={() => this.toggleEditingMode()}>
                    Change your bio!
                </button>
            </div>
        );
    }
}

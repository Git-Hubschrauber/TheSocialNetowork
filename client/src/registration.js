import axios from "./axios";
import React from "react";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            first: "",
            last: "",
            email: "",
            password: "",
        };
    }

    handleChange(e) {
        // console.log("change happens: ", e.target.value);
        // console.log("e.target.name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state: ", this.state)
        );
    }

    handleClick() {
        console.log("submit clicked", this.state);
        const userInput = this.state;
        axios
            .post("/registration", userInput)
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
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log("error in registration: ", err);
            });
    }

    render() {
        return (
            <div className="registrationTable">
                <h1>Registration</h1>
                {this.state.error && <p className="error">An error occurred</p>}
                <div className="inputFields">
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="first"
                        type="text"
                        placeholder="firstname"
                        required
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="last"
                        type="text"
                        placeholder="lastname"
                        required
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        type="email"
                        placeholder="email"
                        required
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="password"
                        type="password"
                        placeholder="password"
                        required
                    />
                    <input
                        type="hidden"
                        name="_csrf"
                        value="{{csrfToken}}"
                    ></input>
                    <button onClick={() => this.handleClick()}>REGISTER</button>
                </div>
                <p>
                    Already registered? Then please{" "}
                    <Link to="/login">LOGIN</Link>
                </p>
            </div>
        );
    }
}

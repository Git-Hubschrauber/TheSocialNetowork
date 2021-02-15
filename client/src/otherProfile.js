import axios from "./axios";
import React from "react";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            ProfilePictureUrl: "",
            error: false,
            editingMode: false,
            noBioInfo: false,
            bio: "",
        };
    }

    async componentDidMount() {
        console.log("this.props.match.params.id: ", this.props.match.params.id);
        const id = this.props.match.params.id;

        axios
            .post("/api/user/" + id)
            .then((resp) => {
                console.log("resp. in otherProfile: ", resp.data);
                if (this.props.match.params.id == resp.data.loggedUser) {
                    this.props.history.push("/");
                }

                console.log(
                    "resp.2 in otherProfile: ",
                    resp.data.userInfo[0].first
                );
                console.log(
                    "resp.3 in otherProfile: ",
                    resp.data.userInfo[0].last
                );
                console.log(
                    "resp.4 in otherProfile: ",
                    resp.data.userInfo[0].profile_pic_url
                );
                this.setState({
                    firstName: resp.data.userInfo[0].first,
                    lastName: resp.data.userInfo[0].last,
                    ProfilePictureUrl:
                        resp.data.userInfo[0].profile_pic_url ||
                        "./default.png",
                    bio: resp.data.userInfo[0].bio,
                });
            })
            .catch((err) => {
                console.log("err in otherProfile", err);
            });
    }

    render() {
        return (
            <div>
                <h1>Other Profile</h1>
                <h1>Bio</h1>
                <img
                    src={this.state.ProfilePictureUrl}
                    alt={this.state.firstName + this.state.lastName}
                />
                <div>first name: {this.state.firstName}</div>
                <div>last name: {this.state.lastName}</div>
                <div>bio: {this.state.bio}</div>
                <button
                    onClick={() => {
                        console.log("back clicked");
                        location.pathname = "/users";
                    }}
                >
                    BACK
                </button>
            </div>
        );
    }
}

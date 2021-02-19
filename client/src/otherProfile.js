import axios from "./axios";
import React from "react";
import FriendButton from "./hooks/friendButton";

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
            friendship: false,
        };
    }

    async componentDidMount() {
        console.log("this.props.match.params.id: ", this.props.match.params.id);
        const id = this.props.match.params.id;

        axios
            .get("/api/user/" + id)
            .then((resp) => {
                console.log("resp. in otherProfile: ", resp.data);
                console.log(
                    "friendship in otherProfile: ",
                    resp.data.friendship
                );
                console.log("this.state.friendship1: ", this.state.friendship);
                if (this.props.match.params.id == resp.data.loggedUser) {
                    this.props.history.push("/");
                }

                if (
                    !resp.data.userInfo.profile_pic_url.startsWith("http") &&
                    !resp.data.userInfo.profile_pic_url.startsWith("/")
                ) {
                    resp.data.userInfo.profile_pic_url =
                        "/" + resp.data.userInfo.profile_pic_url;
                }

                this.setState({
                    firstName: resp.data.userInfo.first,
                    lastName: resp.data.userInfo.last,
                    ProfilePictureUrl:
                        resp.data.userInfo.profile_pic_url || "./default.png",
                    bio: resp.data.userInfo.bio,
                    friendship: resp.data.friendship,
                });
                console.log("this.state.friendship2: ", this.state.friendship);
            })
            .catch((err) => {
                console.log("err in otherProfile", err);
            });
    }

    render() {
        return (
            <div className="otherProfile">
                <h1 className="otherProfileHeader">
                    {this.state.firstName + " " + this.state.lastName}
                </h1>
                <div className="otherProfilePic">
                    <img
                        src={this.state.ProfilePictureUrl}
                        alt={this.state.firstName + this.state.lastName}
                    />
                </div>

                <div className="otherProfileBio">
                    <h2>About {this.state.firstName}:</h2>
                    <p>{this.state.bio}</p>
                </div>
                <div className="friendButton">
                    <FriendButton
                        id={this.props.match.params.id}
                        friendshipState={this.state.friendship}
                    />
                </div>
                <button
                    className="backBtn"
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

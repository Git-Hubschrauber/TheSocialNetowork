import axios from "./axios";
import React from "react";
import FriendButton from "./hooks/friendButton";
import OthersFriends from "./hooks/othersFriends.js";
import { Link } from "react-router-dom";

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
        const id = this.props.match.params.id;

        axios
            .get("/api/user/" + id)
            .then((resp) => {
                if (this.props.match.params.id == resp.data.loggedUser) {
                    this.props.history.push("/");
                }

                if (!resp.data.userInfo.profile_pic_url) {
                    resp.data.userInfo.profile_pic_url = "/default.png";
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
                </h1>{" "}
                <OthersFriends id={this.props.match.params.id} />
                <div className="otherProfilePic">
                    <img
                        className="otherProfileImg"
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
                <Link to={"/users"}>
                    <button className="backBtn">BACK</button>
                </Link>
            </div>
        );
    }
}

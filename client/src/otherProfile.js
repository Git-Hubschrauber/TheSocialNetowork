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
                if (this.props.match.params.id == resp.data.loggedUser) {
                    this.props.history.push("/");
                }

                console.log(
                    "resp.2 in otherProfile: ",
                    resp.data.userInfo.first
                );
                console.log(
                    "resp.3 in otherProfile: ",
                    resp.data.userInfo.last
                );
                console.log(
                    "resp.4 in otherProfile: ",
                    resp.data.userInfo.profile_pic_url
                );
                console.log("resp.5 in otherProfile: ", resp.data.friendship);
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

    // async makeFriendship() {
    //     const id = this.props.match.params.id;
    //     console.log("friendship request made");
    //     try {
    //         const { data } = await axios.post("/api/userInvitation/" + id);
    //         console.log("response friendship request Client", data);
    //     } catch (err) {
    //         console.log("err in friendship request", err);
    //     }
    // }

    // async cancelFriendship() {
    //     const id = this.props.match.params.id;
    //     console.log("friendship cancel request made");
    //     try {
    //         const { data } = await axios.post("/api/cancelInvitation/" + id);
    //         console.log("friendship canceled", data);
    //     } catch (err) {
    //         console.log("err in friendship cancellation", err);
    //     }
    // }

    render() {
        return (
            <div className="otherProfile">
                {/* <h1>Profile</h1> */}
                <h1 className="otherProfileHeader">
                    {this.state.firstName + " " + this.state.lastName}
                </h1>
                <div className="otherProfilePic">
                    <img
                        src={this.state.ProfilePictureUrl}
                        alt={this.state.firstName + this.state.lastName}
                    />
                </div>
                {/* <div>first name: {this.state.firstName}</div>
                <div>last name: {this.state.lastName}</div> */}
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
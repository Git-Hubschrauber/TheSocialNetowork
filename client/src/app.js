import axios from "./axios";
import React from "react";
import ProfilePicture from "./profile-picture";
import Uploader from "./uploader";
import Logo from "./logo";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            ProfilePictureUrl: "",
            uploaderVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setProfilePictureUrl = this.setProfilePictureUrl.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    async componentDidMount() {
        const response = await axios.get("/user");
        console.log("app mounted + response: ", response.data);
        const { first, last, profile_pic_url } = response.data[0];
        this.setState({
            firstName: first,
            lastName: last,
            ProfilePictureUrl: profile_pic_url,
        });
    }

    async componentDidUpdate(prev) {
        if (!this.state.ProfilePictureUrl) {
            this.setState({
                ProfilePictureUrl: "default.png",
            });
            return;
        }
        if (!prev[0]) {
            console.log("prev empty");

            return;
        }
        if (this.state.ProfilePictureUrl !== prev) {
            console.log("profile picture changes: ", prev);
            this.setState({
                ProfilePictureUrl: prev,
            });
        }
    }

    toggleUploader() {
        console.log("toggleUploader clicked");
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    async setProfilePictureUrl(newUrl) {
        await this.setState({
            profilePictureUrl: newUrl,
            uploaderVisible: !this.state.uploaderVisible,
        });
        this.componentDidUpdate(newUrl);
        console.log("new profile picture uploaded: ", newUrl);
    }

    render() {
        return (
            <div className="app">
                <h1>Hello</h1>

                <Logo />

                <ProfilePicture
                    ProfilePictureUrl={this.state.ProfilePictureUrl}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    toggleUploader={this.toggleUploader}
                />

                <button onClick={() => this.toggleUploader()}>
                    New profile picture
                </button>
                {this.state.uploaderVisible && (
                    <Uploader
                        ProfilePictureUrl={this.state.ProfilePictureUrl}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        toggleUploader={this.toggleUploader}
                        setProfilePictureUrl={this.setProfilePictureUrl}
                        componentDidUpdate={this.componentDidUpdate}
                    />
                )}
            </div>
        );
    }
}

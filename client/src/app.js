import axios from "./axios";
import React from "react";
import ProfilePicture from "./profile-picture";
import Uploader from "./uploader";
import Profile from "./profile";
import Logo from "./logo";
import OtherProfile from "./otherProfile";
import { BrowserRouter, Route } from "react-router-dom";
// import BioEditor from "./bio-editor";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            ProfilePictureUrl: "",
            uploaderVisible: false,
            error: false,
            editingMode: false,
            noBioInfo: false,
            age: "",
            gender: "",
            hobbies: "",
            biotext: "",
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setProfilePictureUrl = this.setProfilePictureUrl.bind(this);
        // this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.componentDidUpdate2 = this.componentDidUpdate2.bind(this);
    }

    async componentDidMount() {
        const response = await axios.get("/api/loggedUser");
        console.log("app mounted + response: ", response.data);
        console.log("app mounted: bio: ", response.data[0].bio);
        const { first, last, profile_pic_url } = response.data[0];

        if (response.data[0].bio === null || response.data[0].bio.length == 2) {
            console.log("no bio info");
            return this.setState({
                noBioInfo: true,
            });
        }
        const { age, gender, hobbies, biotext } = JSON.parse(
            response.data[0].bio
        );
        this.setState({
            firstName: first,
            lastName: last,
            ProfilePictureUrl: profile_pic_url,
            age: age,
            gender: gender,
            hobbies: hobbies,
            biotext: biotext,
            noBioInfo: false,
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

    componentDidUpdate2(newProps) {
        if (
            !newProps.age &&
            !newProps.gender &&
            !newProps.hobbies &&
            !newProps.biotext
        ) {
            this.setState({
                age: "",
                gender: "",
                hobbies: "",
                biotext: "",
                noBioInfo: true,
            });
        }
        if (
            this.state.age !== newProps.age ||
            this.state.gender !== newProps.gender ||
            this.state.hobbies !== newProps.hobbies ||
            this.state.biotext !== newProps.biotext
        ) {
            console.log("profile data changed: ", newProps);
            this.setState({
                age: newProps.age,
                gender: newProps.gender,
                hobbies: newProps.hobbies,
                biotext: newProps.biotext,
                noBioInfo: false,
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
            <BrowserRouter>
                <div className="app">
                    <h1>Hello</h1>

                    <Logo />

                    <ProfilePicture
                        key={this.state.ProfilePictureUrl}
                        ProfilePictureUrl={this.state.ProfilePictureUrl}
                        toggleUploader={this.toggleUploader}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        size="small"
                    />

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                key={this.state.noBioInfo}
                                ProfilePictureUrl={this.state.ProfilePictureUrl}
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                toggleUploader={this.toggleUploader}
                                error={this.state.error}
                                editingMode={this.state.EditingMode}
                                noBioInfo={this.state.noBioInfo}
                                age={this.state.age}
                                gender={this.state.gender}
                                hobbies={this.state.hobbies}
                                biotext={this.state.biotext}
                                componentDidUpdate2={this.componentDidUpdate2}
                            />
                        )}
                    />

                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />

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
            </BrowserRouter>
        );
    }
}

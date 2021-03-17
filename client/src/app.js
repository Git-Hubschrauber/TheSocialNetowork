import axios from "./axios";
import React from "react";
import ProfilePicture from "./profile-picture";
import Uploader from "./uploader";
import Profile from "./profile";
import Logout from "./logout";
import Logo from "./logo";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import { Link } from "react-router-dom";
import Friends from "./friends";
import Chat from "./chat";
import Notification from "./hooks/notification";

import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            ProfilePictureUrl: "/default.png",
            uploaderVisible: false,
            error: false,
            editingMode: false,
            noBioInfo: false,
            bio: "",
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setProfilePictureUrl = this.setProfilePictureUrl.bind(this);
        this.componentDidUpdate2 = this.componentDidUpdate2.bind(this);
    }

    async componentDidMount() {
        const response = await axios.get("/api/loggedUser");
        const { first, last, profile_pic_url, bio } = response.data;

        if (response.data.bio === null || response.data.bio.length == 2) {
            return this.setState({
                firstName: first,
                lastName: last,
                ProfilePictureUrl: profile_pic_url || "/default.png",
                noBioInfo: false,
            });
        }

        this.setState({
            firstName: first,
            lastName: last,
            ProfilePictureUrl: profile_pic_url,
            bio: bio,
            noBioInfo: false,
        });
    }

    async componentDidUpdate(prev) {
        if (!prev[0]) {
            return;
        }
        if (this.state.ProfilePictureUrl !== prev) {
            this.setState({
                ProfilePictureUrl: prev,
            });
        }
    }

    componentDidUpdate2(newProps) {
        if (!newProps.bio) {
            this.setState({
                bio: "",
                noBioInfo: true,
            });
        }
        if (this.state.bio !== newProps) {
            this.setState({
                bio: newProps,
                noBioInfo: false,
            });
        }
    }

    toggleUploader() {
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
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <header>
                        <h1 className="darknet" data-text="The Social Network">
                            The Social Network
                        </h1>
                        <Logout />
                        <Logo />
                    </header>

                    <div className="profilePictureElem">
                        <ProfilePicture
                            ProfilePictureUrl={this.state.ProfilePictureUrl}
                            toggleUploader={this.toggleUploader}
                            firstName={this.state.firstName}
                            lastName={this.state.lastName}
                            size="small"
                        />
                        <h1>
                            {this.state.firstName + " " + this.state.lastName}
                        </h1>
                        <Notification />
                        <h2>
                            <Link to="/friends">Friends and invitations</Link>
                        </h2>

                        <h2>
                            <Link to="/users">Find new people</Link>
                        </h2>
                        <h2>
                            <Link to="/chat">Chat</Link>
                        </h2>
                        <h2>
                            <Link to="/">Your profile</Link>
                        </h2>
                    </div>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <div>
                                <Profile
                                    key={this.state.noBioInfo}
                                    ProfilePictureUrl={
                                        this.state.ProfilePictureUrl
                                    }
                                    firstName={this.state.firstName}
                                    lastName={this.state.lastName}
                                    toggleUploader={this.toggleUploader}
                                    error={this.state.error}
                                    editingMode={this.state.EditingMode}
                                    noBioInfo={this.state.noBioInfo}
                                    bio={this.state.bio}
                                    componentDidUpdate2={
                                        this.componentDidUpdate2
                                    }
                                />
                            </div>
                        )}
                    />
                    <Route path="/friends" render={() => <Friends />} />
                    <Route path="/chat" render={() => <Chat />} />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                                ProfilePictureUrl={this.state.ProfilePictureUrl}
                            />
                        )}
                    />
                    <Route
                        path="/users"
                        render={() => (
                            <FindPeople
                                ProfilePictureUrl={this.state.ProfilePictureUrl}
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
                    <footer>
                        <p>created 2021</p>
                    </footer>
                </div>
            </BrowserRouter>
        );
    }
}

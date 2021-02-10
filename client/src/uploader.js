import axios from "./axios";
import React from "react";
import ProfilePicture from "./profile-picture";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
        };
    }

    fileSelectHandler(e) {
        this.file = e.target.files[0];
    }

    async submit() {
        console.log("upload clicked");
        const formData = new FormData();
        formData.append("file", this.file);
        // this.file = "";
        let response = await axios.post("/upload", formData);
        console.log("url in uploader: ", response.data.url);
        await this.props.setProfilePictureUrl(response.data.url);
    }

    render() {
        return (
            <div>
                <div className="uploaderOverlay"></div>
                <div className="uploader">
                    <button
                        className="closeUploader"
                        onClick={this.props.toggleUploader}
                    >
                        X
                    </button>
                    <ProfilePicture
                        ProfilePictureUrl={this.props.ProfilePictureUrl}
                        firstName={this.props.firstName}
                        lastName={this.props.lastName}
                        toggleUploader={this.props.toggleUploader}
                    />
                    <input
                        onChange={(e) => this.fileSelectHandler(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                    />

                    <button onClick={() => this.submit()}>Submit</button>
                </div>
            </div>
        );
    }
}

import ProfilePicture from "./profile-picture";
import BioEditor from "./bio-editor";
import DeleteAccount from "./hooks/deleteAccount";

export default function Profile(props) {
    return (
        <div className="profile">
            <h1 className="otherProfileHeader">Your profile</h1>
            <div className="ownProfilePic">
                <ProfilePicture
                    ProfilePictureUrl={props.ProfilePictureUrl}
                    firstName={props.firstName}
                    lastName={props.lastName}
                    toggleUploader={props.toggleUploader}
                />
                <button
                    className="newProfilePicBtn"
                    onClick={() => props.toggleUploader()}
                >
                    New profile picture
                </button>

                <DeleteAccount />
            </div>

            <BioEditor
                key={props.noBioInfo}
                firstName={props.firstName}
                lastName={props.lastName}
                bio={props.bio}
                toggleEditingMode={props.toggleEditingMode}
                noBioInfo={props.noBioInfo}
                componentDidUpdate2={props.componentDidUpdate2}
            />
            {/* <Friends /> */}
        </div>
    );
}

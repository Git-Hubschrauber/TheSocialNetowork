import ProfilePicture from "./profile-picture";
import BioEditor from "./bio-editor";

export default function Profile(props) {
    return (
        <div>
            <h1>I am the profile component {props.firstName}</h1>
            <ProfilePicture
                ProfilePictureUrl={props.ProfilePictureUrl}
                firstName={props.firstName}
                lastName={props.lastName}
                toggleUploader={props.toggleUploader}
            />
            <button onClick={() => props.toggleUploader()}>
                New profile picture
            </button>
            <BioEditor
                firstName={props.firstName}
                lastName={props.lastName}
                age={props.age}
                gender={props.gender}
                hobbies={props.hobbies}
                biotext={props.biotext}
                toggleEditingMode={props.toggleEditingMode}
                noBioInfo={props.noBioInfo}
                componentDidUpdate2={props.componentDidUpdate2}
            />
        </div>
    );
}

export default function (props) {
    console.log(
        "props.profilePictureUrl in profilepicture: ",
        props.ProfilePictureUrl
    );

    return (
        <div>
            <img
                onClick={props.toggleUploader}
                src={props.ProfilePictureUrl || "/default.png"}
                alt={props.firstName + props.lastName}
            />
            <div>
                <label>{props.firstName + " " + props.lastName}</label>
            </div>
        </div>
    );
}

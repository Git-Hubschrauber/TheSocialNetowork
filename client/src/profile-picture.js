export default function ({
    ProfilePictureUrl,
    firstName,
    lastName,
    toggleUploader,
    size = "",
}) {
    console.log(
        "props.profilePictureUrl in profilepicture: ",
        ProfilePictureUrl
    );
    if (
        !ProfilePictureUrl.startsWith("http") &&
        !ProfilePictureUrl.startsWith("/")
    ) {
        ProfilePictureUrl = "/" + ProfilePictureUrl;
    }
    return (
        // <div>
        <img
            onClick={toggleUploader}
            src={ProfilePictureUrl || "/default.png"}
            alt={firstName + lastName}
            className={size}
        />
    );
}

{
    /* <div>
            <label>{firstName + " " + lastName}</label>
        </div>
    </div> */
}

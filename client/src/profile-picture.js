export default function ({
    ProfilePictureUrl,
    firstName,
    lastName,
    toggleUploader,
    size = "",
}) {
    if (!ProfilePictureUrl) {
        ProfilePictureUrl = "/default.png";
    }

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

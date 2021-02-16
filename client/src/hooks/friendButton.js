import axios from "../axios";

export default function (props) {
    const id = props.id;
    const friendshipState = props.friendshipState;
    console.log("friendship request made to:", id);
    // console.log("friendship state accepted:", friendshipState.accepted);
    // console.log("friendship state:", friendshipState);

    // const [friendshipStatus, setFriendshipStatus] = useState({});

    const makeFriendship = () => {
        axios
            .post("/api/userInvitation/" + id)
            .then((data) => {
                console.log("response friendship request Client", data);
            })
            .catch((err) => {
                console.log("err in friendship request", err);
            });
    };

    const acceptFriendship = () => {
        axios
            .post("/api/acceptInvitation/" + id)
            .then((data) => {
                console.log("response friendship request Client", data);
                // setFriendshipStatus("made");
            })
            .catch((err) => {
                console.log("err in friendship request", err);
            });
    };

    const cancelFriendship = function () {
        const id = props.id;
        console.log("friendship cancel request made");
        axios
            .post("/api/cancelInvitation/" + id)
            .then(({ data }) => {
                console.log("friendship canceled", data);
            })
            .catch((err) => {
                console.log("err in friendship cancellation", err);
            });
    };

    return (
        <div>
            {typeof friendshipState == "undefined" && (
                <button onClick={() => makeFriendship()}>
                    Send friendship request
                </button>
            )}
            {typeof friendshipState != "undefined" &&
                friendshipState.accepted == false &&
                friendshipState.sender_id != id && (
                    <button onClick={() => cancelFriendship()}>
                        Cancel friendship request
                    </button>
                )}
            {typeof friendshipState != "undefined" &&
                friendshipState.accepted == false &&
                friendshipState.sender_id == id && (
                    <button onClick={() => acceptFriendship()}>
                        Accept friendship request
                    </button>
                )}

            {typeof friendshipState != "undefined" &&
                friendshipState.accepted == true && (
                    <button onClick={() => cancelFriendship()}>
                        End friendship
                    </button>
                )}
        </div>
    );
}

import axios from "../axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../socket";
import { notifyFriendRequest } from "../actions";

export default function (props) {
    const id = props.id;
    const dispatch = useDispatch();
    let friendshipState;

    let [friendshipStatus, setfriendshipStatus] = useState("none");
    // console.log("friendshipState outside: ", friendshipState);
    // console.log("friendshipState id outside: ", id);

    useEffect(() => {
        axios.get("/api/user/" + id).then((resp) => {
            // console.log("response in friendsbutton: ", resp.data.friendship);
            friendshipState = resp.data.friendship;
            // console.log("friendshipState inside: ", friendshipState);
            if (friendshipState === undefined) {
                return setfriendshipStatus("none");
            }
            if (
                typeof friendshipState !== undefined &&
                friendshipState.accepted == false &&
                friendshipState.recipient_id == id
            ) {
                return setfriendshipStatus("sent");
            }
            if (
                typeof friendshipState !== undefined &&
                friendshipState.accepted == false &&
                friendshipState.sender_id == id
            ) {
                return setfriendshipStatus("received");
            }
            if (
                typeof friendshipState != undefined &&
                friendshipState.accepted == true
            ) {
                return setfriendshipStatus("accepted");
            }
        });
    }, []);

    // console.log("friendship request made to:", id);

    const makeFriendship = () => {
        axios
            .post("/api/userInvitation/" + id)
            .then((data) => {
                dispatch(notifyFriendRequest(data.data));
                console.log("response friendship request Client", data);
                setfriendshipStatus("sent");
            })
            .catch((err) => {
                console.log("err in friendship request", err);
            });
    };

    const acceptFriendship = () => {
        axios
            .post("/api/acceptInvitation/" + id)
            .then((data) => {
                // console.log("response friendship request Client", data);
                setfriendshipStatus("accepted");
            })
            .catch((err) => {
                console.log("err in friendship request", err);
            });
    };

    const cancelFriendship = function () {
        const id = props.id;
        // console.log("friendship cancel request made");
        axios
            .post("/api/cancelInvitation/" + id)
            .then(({ data }) => {
                // console.log("friendship canceled", data);
                setfriendshipStatus("none");
            })
            .catch((err) => {
                console.log("err in friendship cancellation", err);
            });
    };

    return (
        <div>
            {friendshipStatus == "none" && (
                <button onClick={() => makeFriendship()}>
                    Send friendship request
                </button>
            )}
            {friendshipStatus == "sent" && (
                <button onClick={() => cancelFriendship()}>
                    Cancel friendship request
                </button>
            )}
            {friendshipStatus == "received" && (
                <button onClick={() => acceptFriendship()}>
                    Accept friendship request
                </button>
            )}

            {friendshipStatus == "accepted" && (
                <button onClick={() => cancelFriendship()}>
                    End friendship
                </button>
            )}
        </div>
    );
}

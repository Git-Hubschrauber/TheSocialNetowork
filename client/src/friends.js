import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { acceptFriendship, askForFriendsandRequests } from "./actions";
import { unfriend } from "./actions";
import { Link } from "react-router-dom";

export default function () {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(askForFriendsandRequests());
    }, []);

    const sendfriendshipRequests = useSelector(
        (state) =>
            state.usersForFriendship &&
            state.usersForFriendship.filter((user) => {
                if (user.accepted === false && user.id === user.recipient_id) {
                    console.log("accepted false + send: ", user);
                    return user;
                }
            })
    );

    const friends = useSelector(
        (state) =>
            state.usersForFriendship &&
            state.usersForFriendship.filter((user) => {
                if (user.accepted === true) {
                    console.log("accepted true: ", user);
                    return user;
                }
            })
    );
    const receivedfriendshipRequests = useSelector(
        (state) =>
            state.usersForFriendship &&
            state.usersForFriendship.filter((user) => {
                if (user.accepted === false && user.id === user.sender_id) {
                    console.log("accepted false + received: ", user);
                    return user;
                }
            })
    );
    console.log("friends.js here");

    console.log("friends.js here - friends: ", friends);
    console.log(
        "friends.js here - sendfriendshipRequests: ",
        sendfriendshipRequests
    );
    console.log(
        "friends.js here - receivedfriendshipRequests: ",
        receivedfriendshipRequests
    );

    if (!sendfriendshipRequests) {
        return null;
    }
    if (!receivedfriendshipRequests) {
        return null;
    }

    if (!friends) {
        return null;
    }

    let friends2;
    if (friends.length === 0) {
        friends2 = (
            <div className="friends2">
                <table>
                    <tbody>
                        <tr>
                            <td className="friendStatus">
                                <h2>Your friends</h2>
                            </td>

                            <td className="friends3">
                                <h1 className="nofriends">
                                    You have no friends
                                </h1>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    } else {
        friends2 = (
            <div className="friends2">
                <table>
                    <tbody>
                        <tr>
                            <td className="friendStatus">
                                <h2>Your friends</h2>
                            </td>

                            <td className="friends3">
                                {friends.map((friends) => (
                                    <div className="friends" key={friends.id}>
                                        <Link to={"user/" + friends.id}>
                                            <img
                                                src={friends.profile_pic_url}
                                            />
                                            <div className="buttons">
                                                <button
                                                    className="buttons rejectBtn"
                                                    onClick={() =>
                                                        dispatch(
                                                            unfriend(friends.id)
                                                        )
                                                    }
                                                >
                                                    <span className="emoji">
                                                        ❌
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="nameTag">
                                                {friends.first +
                                                    " " +
                                                    friends.last}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    let receivedfriendshipRequests2;
    if (receivedfriendshipRequests.length === 0) {
        receivedfriendshipRequests2 = (
            <div className="friends2">
                <table>
                    <tbody>
                        <tr>
                            <td className="friendStatus">
                                <h2 className="nofriends">
                                    Wants to be your friend
                                </h2>
                            </td>

                            <td className="friends3">
                                <h1>You have no friendship requests</h1>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    } else {
        receivedfriendshipRequests2 = (
            <div className="friends2">
                <table>
                    <tbody>
                        <tr>
                            <td className="friendStatus">
                                <h2>Wants to be your friend</h2>{" "}
                            </td>
                            <td className="friends3">
                                {receivedfriendshipRequests.map((friends) => (
                                    <div className="friends" key={friends.id}>
                                        <Link to={"user/" + friends.id}>
                                            <img
                                                src={friends.profile_pic_url}
                                            />
                                            <div className="button">
                                                <button
                                                    className="acceptBtn"
                                                    onClick={() =>
                                                        dispatch(
                                                            acceptFriendship(
                                                                friends.id
                                                            )
                                                        )
                                                    }
                                                >
                                                    <span className="emoji">
                                                        ✔️
                                                    </span>
                                                </button>
                                                <button
                                                    className="rejectBtn"
                                                    onClick={() =>
                                                        dispatch(
                                                            unfriend(friends.id)
                                                        )
                                                    }
                                                >
                                                    <span className="emoji">
                                                        ❌
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="nameTag">
                                                {friends.first +
                                                    " " +
                                                    friends.last}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    let sendfriendshipRequests2;
    if (sendfriendshipRequests.length === 0) {
        sendfriendshipRequests2 = (
            <div className="friends2">
                <table>
                    <tbody>
                        <tr>
                            <td className="friendStatus">
                                <h2 className="nofriends">Your friendship</h2>
                            </td>

                            <td className="friends3">
                                <h1 className="nofriends">
                                    You have no friendship request sent
                                </h1>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    } else {
        sendfriendshipRequests2 = (
            <div className="friends2">
                <table>
                    <tbody>
                        <tr>
                            <td className="friendStatus">
                                <h2>Your friendship requests</h2>
                            </td>
                            <td className="friends3">
                                {sendfriendshipRequests.map((friends) => (
                                    <div className="friends" key={friends.id}>
                                        <Link to={"user/" + friends.id}>
                                            <img
                                                src={friends.profile_pic_url}
                                            />
                                            <div className="buttons">
                                                <button
                                                    className="rejectBtn"
                                                    onClick={() =>
                                                        dispatch(
                                                            unfriend(friends.id)
                                                        )
                                                    }
                                                >
                                                    <span className="emoji">
                                                        ❌
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="nameTag">
                                                {friends.first +
                                                    " " +
                                                    friends.last}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="friends1">
            {friends2}

            {receivedfriendshipRequests2}

            {sendfriendshipRequests2}
            <Link to={"/"}>
                <button className="backBtn">BACK</button>
            </Link>
        </div>
    );
}

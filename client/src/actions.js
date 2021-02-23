import axios from "./axios";

export async function askForFriendsandRequests() {
    const { data } = await axios.get("/api/friends");
    // console.log("data from askForFriendsAndRequests: ", data.friendships);
    // console.log("data from askForFriendsAndRequests: ", data.loggedUser);
    return {
        type: "FRIENDSHIPSTATUS_REQUEST",
        usersForFriendship: data.friendships,
        loggedUser: data.loggedUser,
    };
}

export async function unfriend(id) {
    await axios.post("/api/cancelInvitation/" + id);
    console.log("unfriend button clicked: ", id);

    const { data } = await axios.get("/api/friends");
    return {
        type: "FRIENDSHIPSTATUS_REQUEST",
        usersForFriendship: data.friendships,
        loggedUser: data.loggedUser,
    };
}

export async function acceptFriendship(id) {
    await axios.post("/api/acceptInvitation/" + id);
    console.log("accept button clicked: ", id);

    const { data } = await axios.get("/api/friends");
    return {
        type: "FRIENDSHIPSTATUS_REQUEST",
        usersForFriendship: data.friendships,
        loggedUser: data.loggedUser,
    };
}

export async function checkFriendshipStatus(id) {
    console.log("checkFriendshipStatus executed: ", id);

    await axios.get("/api/user/" + id);
    return {
        type: "FRIENDSHIPSTATUS_CHECK",
        checkedId: id,
    };
}

//   * An action for when the 10 most recent messages are received

export function chatMessages(msgs) {
    console.log("last 10 chat messages: ", msgs);

    return { type: "MESSAGES", messages: msgs };
}

// * An action for when individual new messages are received

export function chatMessage(msg) {
    console.log("chat messages sent: ", msg);

    return { type: "MESSAGE", message: msg };
}

export function sendNewMessage(newMessage) {
    console.log("just posted message: ", newMessage);

    return {
        type: "NEW_MESSAGE",
        newMessage,
    };
}

export async function getOthersFriends(id) {
    const { data } = await axios.get("/api/viewFriends/" + id);
    const friends = data.reverse();
    console.log("actions resp. from /api/viewFriends/: ", friends);

    return {
        type: "OTHERS_FRIENDS",
        friends,
    };
}

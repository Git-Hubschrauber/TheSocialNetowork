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

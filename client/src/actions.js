import axios from "./axios";
import { socket } from "./socket";

export async function askForFriendsandRequests() {
    const { data } = await axios.get("/api/friends");
    return {
        type: "FRIENDSHIPSTATUS_REQUEST",
        usersForFriendship: data.friendships,
        loggedUser: data.loggedUser,
    };
}

export async function unfriend(id) {
    await axios.post("/api/cancelInvitation/" + id);
    const { data } = await axios.get("/api/friends");
    return {
        type: "FRIENDSHIPSTATUS_REQUEST",
        usersForFriendship: data.friendships,
        loggedUser: data.loggedUser,
    };
}

export async function acceptFriendship(id) {
    await axios.post("/api/acceptInvitation/" + id);
    const { data } = await axios.get("/api/friends");
    return {
        type: "FRIENDSHIPSTATUS_REQUEST",
        usersForFriendship: data.friendships,
        loggedUser: data.loggedUser,
    };
}

export async function checkFriendshipStatus(id) {
    await axios.get("/api/user/" + id);
    return {
        type: "FRIENDSHIPSTATUS_CHECK",
        checkedId: id,
    };
}

export function chatMessages(msgs) {
    return { type: "MESSAGES", messages: msgs };
}

export function chatMessage(msg) {
    return { type: "MESSAGE", message: msg };
}

export function sendNewMessage(newMessage) {
    return {
        type: "NEW_MESSAGE",
        newMessage,
    };
}

export async function getOthersFriends(id) {
    const { data } = await axios.get("/api/viewFriends/" + id);
    const friends = data.reverse();
    return {
        type: "OTHERS_FRIENDS",
        friends,
    };
}

export function OtherOnlineUsers(otherOnlineUsersData) {
    return {
        type: "OTHERS_ONLINEUSERS",
        otherOnlineUsersData,
    };
}

export function newOnlineUser(newUserInfo) {
    return {
        type: "NEW_ONLINEUSER",
        newUserInfo,
    };
}

export function notifyFriendRequest(data) {
    socket.emit("request", data.recipient_id);
    return {
        type: "NOTIFY_FRIENDSHIPREQUEST",
        data,
    };
}
export function displayFriendRequest(data_2) {
    return {
        type: "NOTIFY_FRIENDSHIPREQUEST_2",
        data_2,
    };
}

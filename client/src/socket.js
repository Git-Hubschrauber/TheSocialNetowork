import {
    chatMessages,
    chatMessage,
    sendNewMessage,
    OtherOnlineUsers,
    newOnlineUser,
    displayFriendRequest,
} from "./actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => {
            return store.dispatch(chatMessages(msgs));
        });

        socket.on("chatMessage", (msg) => {
            return store.dispatch(chatMessage(msg));
        });

        socket.on("newMessage", (newMessage) => {
            return store.dispatch(sendNewMessage(newMessage));
        });

        socket.on("whoElseIsOnline", (otherOnlineUsersData) => {
            return store.dispatch(OtherOnlineUsers(otherOnlineUsersData));
        });

        socket.on("newUserJoined", (newUserInfo) => {
            return store.dispatch(newOnlineUser(newUserInfo));
        });

        // socket.on("displayFriendRequest", (data_2) => {
        //     return store.dispatch(displayFriendRequest(data_2));
        // });
    }
};

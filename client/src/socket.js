import {
    chatMessages,
    chatMessage,
    sendNewMessage,
    OtherOnlineUsers,
    newOnlineUser,
} from "./actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => {
            // console.log("socket js messages: ", msgs);
            return store.dispatch(chatMessages(msgs));
        });

        socket.on("chatMessage", (msg) => {
            // console.log("socket js message: ", msg);
            return store.dispatch(chatMessage(msg));
        });

        socket.on("newMessage", (newMessage) => {
            // console.log("socket js New Message: ", newMessage);
            return store.dispatch(sendNewMessage(newMessage));
        });

        socket.on("whoElseIsOnline", (otherOnlineUsersData) => {
            console.log("socket js whoElseIsOnline: ", otherOnlineUsersData);
            return store.dispatch(OtherOnlineUsers(otherOnlineUsersData));
        });

        socket.on("newUserJoined", (newUserInfo) => {
            console.log("newUserJoined: ", newUserInfo);
            return store.dispatch(newOnlineUser(newUserInfo));
        });
    }
};

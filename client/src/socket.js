import { chatMessages, chatMessage, sendNewMessage } from "./actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => {
            console.log("socket js messages: ", msgs);
            store.dispatch(chatMessages(msgs));
        });

        socket.on("chatMessage", (msg) => {
            console.log("socket js message: ", msg);
            store.dispatch(chatMessage(msg));
        });

        socket.on("newMessage", (newMessage) => {
            console.log("socket js New Message: ", newMessage);
            store.dispatch(sendNewMessage(newMessage));
        });
    }
};

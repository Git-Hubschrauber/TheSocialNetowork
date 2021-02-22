// * chat.js

//     * Must import the socket object from socket.js so that `emit` can be called on it

//     * Component must use `useSelector` to get the chat messages out of Redux. It needs to map them into elements and render them

//     * Component must render a textarea in which the user can type and provide some mechanism for the user to send the message she has typed

//     * Whatever UI you choose for sending the message, what your code must do is emit a socket event with the current value of the textarea in the payload

import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { chatMessages, chatMessage } from "./actions";

export default function () {
    const dispatch = useDispatch();
    const [msg, setMsg] = useState("");

    useEffect((msg) => {
        dispatch(chatMessage(msg));
    }, []);

    const lastTenMessages = useSelector(
        (state) =>
            state.messages &&
            state.messages.map((element) => {
                console.log("mes in useSelector: ", element);
                return element;
            })
    );

    function handleChange(event) {
        setMsg(event.target.value);

        console.log("Message input: ", event.target.value);
        console.log("Msg: ", msg);
    }

    if (!lastTenMessages) {
        return null;
    }

    console.log("last ten messages: ", lastTenMessages);
    let existingMessages;

    if (lastTenMessages.length === 0) {
        existingMessages = <h2>No messages</h2>;
    } else {
        existingMessages = (
            <div>
                {lastTenMessages.map((element) => (
                    <div key={element.id}>
                        <img
                            className="chatImg"
                            src={element.profile_pic_url}
                        />
                        <p>{element.first + " " + element.last}</p>
                        <p>{element.sent_message}</p>
                        <p>
                            {element.sent_timestamp.slice(0, 10) +
                                " / " +
                                element.sent_timestamp.slice(11, 19)}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    // if (!x) {
    //     return null;
    // }

    // let x;
    // if (x.length === 0) {
    //     x = <div className="x"></div>;
    // } else {
    //     x = <div className="x"></div>;
    // }

    return (
        <div>
            <div className="messagebox">{existingMessages}</div>
            <textarea className="chatbox" onChange={handleChange}></textarea>
            <button
                className="chatSendBtn"
                onClick={() => {
                    dispatch(chatMessage(msg));
                    socket.emit("chatMessage", msg);
                }}
            >
                SEND
            </button>
            <Link to={"/"}>
                <button className="backBtn">BACK</button>
            </Link>
        </div>
    );
}

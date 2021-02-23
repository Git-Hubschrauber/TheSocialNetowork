// * chat.js

//     * Must import the socket object from socket.js so that `emit` can be called on it

//     * Component must use `useSelector` to get the chat messages out of Redux. It needs to map them into elements and render them

//     * Component must render a textarea in which the user can type and provide some mechanism for the user to send the message she has typed

//     * Whatever UI you choose for sending the message, what your code must do is emit a socket event with the current value of the textarea in the payload

import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { chatMessages, chatMessage } from "./actions";

export default function () {
    const textRef = useRef("");
    const scrollRef = useRef();
    const dispatch = useDispatch();
    const [msg, setMsg] = useState("");

    const lastTenMessages = useSelector((state) => state.messages);

    // const scrollToBottom = () => {
    //     scrollRef.current.scrollTop =
    //         scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    // };

    useEffect(() => {
        // scrollToBottom();
        dispatch(chatMessage(msg));
    }, []);

    function handleChange(event) {
        textRef.current.value = event.target.value;
        setMsg(event.target.value);

        // console.log("Message input: ", event.target.value);
        // console.log("Msg: ", msg);
    }

    if (!lastTenMessages) {
        return null;
    }

    // console.log("last ten messages: ", lastTenMessages);
    let existingMessages;

    if (lastTenMessages.length === 0) {
        existingMessages = <h2>No messages</h2>;
    } else {
        existingMessages = (
            <div className="messagebox1" ref={scrollRef}>
                {lastTenMessages.map((element) => (
                    <div key={element.id} className="messagebox">
                        <div>
                            <img
                                className="chatImg"
                                src={element.profile_pic_url}
                            />
                        </div>
                        <div>
                            <div className="chatSender">
                                {element.first + " " + element.last}
                            </div>
                            <div className="chatTime">
                                {element.sent_timestamp.slice(0, 10) +
                                    " / " +
                                    element.sent_timestamp.slice(11, 19)}
                            </div>
                            <div className="chatMessage">
                                {element.sent_message}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="messagebox2">{existingMessages}</div>
            <textarea
                className="chatbox"
                id="chatbox"
                onChange={handleChange}
                ref={textRef}
            ></textarea>
            <button
                className="chatSendBtn"
                onClick={() => {
                    dispatch(chatMessage(msg));
                    socket.emit("chatMessage", msg);

                    console.log("reset?");

                    textRef.current.value = "";
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

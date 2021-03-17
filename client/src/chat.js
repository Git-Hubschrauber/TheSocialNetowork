import { socket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { chatMessage } from "./actions";

export default function () {
    const scrollRef = useRef(null);
    const textRef = useRef(null);
    const dispatch = useDispatch();
    const [msg, setMsg] = useState("");

    const lastTenMessages = useSelector((state) => state.messages);
    const otherOnlineUsers = useSelector((state) => state.otherOnlineUsers);
    const scrollToBottom = () => {
        scrollRef.current.scrollTop =
            scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    };

    //
    //

    useEffect(() => {
        if (lastTenMessages) {
            scrollToBottom();
        }
    }, [lastTenMessages]);

    useEffect(() => {
        dispatch(chatMessage(msg));
    }, []);

    useEffect(() => {
        if (otherOnlineUsers) {
            console.log("newUser in chat");
        }
    }, [otherOnlineUsers]);

    //
    //

    function handleChange(event) {
        textRef.current.value = event.target.value;
        setMsg(event.target.value);
    }

    let existingMessages;

    if (!lastTenMessages || lastTenMessages.length === 0) {
        existingMessages = <h2>No messages</h2>;
    } else {
        existingMessages = (
            <div className="messagebox1" ref={scrollRef}>
                {lastTenMessages.map((element) => (
                    <div key={element.id} className="messagebox">
                        <div>
                            <img
                                className="chatImg"
                                src={element.profile_pic_url || "/default.png"}
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

    let online;
    if (otherOnlineUsers.length === 0) {
        online = <h1>No other user online</h1>;
    } else {
        online = (
            <div className="mappingOnlineUsers">
                {otherOnlineUsers.map((element) => (
                    <div className="mappingSingleOnlineUsers" key={element.id}>
                        <img
                            className="chatImg"
                            src={element.profile_pic_url || "/default.png"}
                        />
                        <div className="onlineUsersName">
                            <div>{element.first}</div>
                            <div>{element.last}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="usersOnline">
                <h1>Users online</h1>
                {online}
            </div>
            <div className="messagebox2">{existingMessages}</div>
            <textarea
                ref={textRef}
                className="chatbox"
                id="chatbox"
                placeholder="Enter message"
                onChange={handleChange}
            ></textarea>
            <button
                className="chatSendBtn"
                onClick={() => {
                    dispatch(chatMessage(msg));
                    socket.emit("chatMessage", msg);
                    textRef.current.value = "";
                    textRef.current.focus();
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

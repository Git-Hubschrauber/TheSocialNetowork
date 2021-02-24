import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { displayFriendRequest } from "../actions";

export default function () {
    const dispatch = useDispatch();
    const requests = useSelector((state) => state.request_data_2);
    console.log("requests in notification.js: ", requests);

    useEffect(() => {
        if (requests) {
            console.log("request exits");
        }
    }, [requests]);

    let notificationMessage;

    if (!requests) {
        return null;
    } else {
        if (requests === 1) {
            notificationMessage = <div>{requests} friend request</div>;
        } else {
            notificationMessage = <div>{requests} friend requests</div>;
        }
    }

    return <div>{notificationMessage}</div>;
}

export function reducer(state = {}, action) {
    if (action.type === "FRIENDSHIPSTATUS_REQUEST") {
        state = {
            ...state,
            usersForFriendship: action.usersForFriendship,
            loggedUser: action.loggedUser,
        };
    }

    if (action.type === "FRIENDSHIPSTATUS_CHECK") {
        state = {
            ...state,
            checkedId: action.checkedId,
        };
    }

    if (action.type === "MESSAGES") {
        state = {
            ...state,
            messages: action.messages,
        };
    }

    if (action.type === "MESSAGE") {
        state = {
            ...state,
            message: action.message,
        };
    }

    if (action.type === "NEW_MESSAGE") {
        state = {
            ...state,
            messages: [...state.messages, action.newMessage],
        };
    }

    if (action.type === "OTHERS_FRIENDS") {
        state = {
            ...state,
            friends: action.friends,
        };
    }

    if (action.type === "OTHERS_ONLINEUSERS") {
        state = {
            ...state,
            otherOnlineUsers: action.otherOnlineUsersData,
        };
    }

    if (action.type === "NEW_ONLINEUSER") {
        state = {
            ...state,
            otherOnlineUsers: [...state.otherOnlineUsers, action.newUserInfo],
        };
    }
    if (action.type === "NOTIFY_FRIENDSHIPREQUEST") {
        state = {
            ...state,
            request_data: action.data,
        };
    }
    if (action.type === "NOTIFY_FRIENDSHIPREQUEST_2") {
        state = {
            ...state,
            request_data_2: action.data_2,
        };
    }

    return state;
}

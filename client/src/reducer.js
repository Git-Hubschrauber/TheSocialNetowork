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
    return state;
}

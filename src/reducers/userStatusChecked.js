const userStatusCheckReducer = (state = false, action) => {
    switch (action.type) {
        case 'USER_CHECKED':
            state = true;
            break;
        case 'USER_UNCHECKED':
            state = false;
            break;
    }

    return state;
}

export default userStatusCheckReducer;
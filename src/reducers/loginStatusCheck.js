const loginStatusCheckReducer = (state = true, action) => {
    switch (action.type) {
        case 'TURN_OFF_LOGIN_CHECK':
            state = false;
            break;
        case 'TURN_ON_LOGIN_CHECK':
            state = true;
            break;
        default:
            return state;
    }

    return state;
}

export default loginStatusCheckReducer;
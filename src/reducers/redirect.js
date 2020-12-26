const redirectURL = (state = null, action) => {
    switch (action.type) {
        case 'SET_REDIRECT_URL':
            state = action.url;
            break;
        case 'RESET_REDIRECT_URL':
            state = null;
            break;
    }

    return state;
}

export default redirectURL;
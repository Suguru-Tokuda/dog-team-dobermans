const userReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_USER':
            state = action.user;
            break;
    }

    return state;
}

export default userReducer;
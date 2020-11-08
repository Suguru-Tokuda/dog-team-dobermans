export const signIn = () => {
    return {
        type: 'SIGN_IN'
    };
}

export const signOut = () => {
    return {
        type: 'SIGN_OUT'
    };
}

export const setUser = (user) => {
    return {
        type: 'SET_USER',
        user: user
    };
}
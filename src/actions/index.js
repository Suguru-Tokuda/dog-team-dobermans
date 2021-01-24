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

export const resetUser = () => {
    return {
        type: 'RESET_USER'
    };
}

export const checkUser = () => {
    return {
        type: 'USER_CHECKED'
    };
}

export const uncheckUser = () => {
    return {
        type: 'USER_UNCHECKED'
    };
}

export const showLoading = (params) => {
    return {
        type: 'SHOW_LOADING',
        reset: params.reset,
        count: params.count
    };
}

export const doneLoading = (resetAll) => {
    return {
        type: 'DONE_LOADING',
        resetAll: resetAll
    };
}

export const setRedirectURL = (url) => {
    return {
        type: 'SET_REDIRECT_URL',
        url: url
    };
}

export const resetRedirectURL = () => {
    return {
        type: 'RESET_REDIRECT_URL'
    };
}

export const turnOffLoginStatusCheck = () => {
    return {
        type: 'TURN_OFF_LOGIN_CHECK'
    };
}

export const turnOnLoginStatusCheck = () => {
    return {
        type: 'TURN_ON_LOGIN_CHECK'
    };
}
const contactReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_CONTACT':
            state = action.contactData
    }

    return state
}

export default contactReducer;
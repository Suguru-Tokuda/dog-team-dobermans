const loaderReducer = (state = 0, action) => {
    switch (action.type) {
        case 'SHOW_LOADING':
            if (action.params.reset === true)
                state = action.params.count;
            else
                state += action.params.count;
            break;
        case 'DONE_LOADING':
            if (action.resetAll === true)
                state = 0;
            else
                state--;
            break;
    }
    
    return state;
};

export default loaderReducer;
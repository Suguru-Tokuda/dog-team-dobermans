import authenticationReducer from './authentication';
import userReducer from './user';
import loader from './loader';
import userChecked from './userStatusChecked';
import loginStatusCheck from './loginStatusCheck';
import redirectURL from './redirect';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    authenticated: authenticationReducer,
    user: userReducer,
    loadCount: loader,
    userChecked: userChecked,
    loginStatusCheck: loginStatusCheck,
    redirectURL: redirectURL
});

export default allReducers;
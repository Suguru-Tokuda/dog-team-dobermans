import authenticationReducer from './authentication';
import userReducer from './user';
import loader from './loader';
import userChecked from './userStatusChecked';
import loginStatusCheck from './loginStatusCheck';
import redirectURL from './redirect';
import contactReducer from './contact';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    authenticated: authenticationReducer,
    user: userReducer,
    loadCount: loader,
    userChecked: userChecked,
    loginStatusCheck: loginStatusCheck,
    redirectURL: redirectURL,
    contact: contactReducer
});

export default allReducers;
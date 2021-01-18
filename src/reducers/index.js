import authenticationReducer from './authentiation';
import userReducer from './user';
import loader from './loader';
import userChecked from './userStatusChecked';
import redirectURL from './redirect';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    authenticated: authenticationReducer,
    user: userReducer,
    loadCount: loader,
    userChecked: userChecked,
    redirectURL: redirectURL
});

export default allReducers;
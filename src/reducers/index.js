import loginReducer from './isLogged';
import userReducer from './user';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    login: loginReducer,
    user: userReducer
});

export default allReducers;
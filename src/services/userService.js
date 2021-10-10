import SessionInfoService from './sessionInfoService';
import axios from 'axios';

export default class UserService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/users`;
    }

    static getUser(userID) {
        return axios.get(`${this.getServiceBase()}?userID=${userID}`);
    }

    static createUser(data) {
        return axios.post(`${this.getServiceBase()}`, data);
    }

    static editUser(data) {
        return axios.put(`${this.getServiceBase()}`, data);
    }
}
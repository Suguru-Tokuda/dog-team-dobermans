import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class UserService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}buyer`;
    }

    static getUser(userID) {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}&buyerID=${userID}`);
    }

    static createUser(data) {
        return axios.post(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }

    static editUser(data) {
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }
}
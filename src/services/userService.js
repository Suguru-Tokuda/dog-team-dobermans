import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class UserService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}buyer`;
    }

    static getUser(userID) {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}&buyerID=${userID}`)
    }

    static createUser(firstName, lastName, email, phone, city, state) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            city: city,
            state: state
        };

        return axios.post(`${this.getServiceBase()}s?key=${api.API_KEY}`, data);
    }

    static editUser(firstName, lastName, email, phone, city, state) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            city: city,
            state: state
        };

        return axios.put(`${this.getServiceBase()}s?key=${api.API_KEY}`, data);
    }
}
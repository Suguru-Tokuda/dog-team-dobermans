import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class WaitListService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}waitList`;
    }

    static createWaitRequest(firstName, lastName, email, phone, message, color, date) {
        const data = {
            firsName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            message: message,
            color: color,
            created: date,
            notified: null
        };
        return axios.post(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }
}
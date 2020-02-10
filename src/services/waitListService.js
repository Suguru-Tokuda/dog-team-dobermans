import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class WaitListService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}waitList`;
    }

    static createWaitRequest(firstName, lastName, email, phone, message, color, expectedPurchaseDate, date) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            message: message,
            color: color,
            expectedPurchaseDate: expectedPurchaseDate,
            created: date,
            notified: null
        };
        return axios.post(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }
}
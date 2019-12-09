import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class ContactService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}contact`;
    }

    static getContact() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }
    
}
import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class AboutDobermanService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}aboutDobermans?key=${api.API_KEY}`;
    }

    static getAboutDobermans() {
        return axios.get(`${this.getServiceBase()}`);
    }
}
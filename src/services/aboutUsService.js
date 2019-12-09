import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class AboutUsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}aboutUs`;
    }

    static getAboutUs() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }
}
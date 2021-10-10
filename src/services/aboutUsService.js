import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class AboutUsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/aboutUs`;
    }

    static getAboutUs() {
        return axios.get(`${this.getServiceBase()}`);
    }
}
import SessionInfoService from './sessionInfoService';
import axios from 'axios';

export default class AboutUsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/aboutUs`;
    }

    static getAboutUs() {
        return axios.get(`${this.getServiceBase()}`);
    }

    static getAboutDobermans() {
        return axios.get(`${this.getServiceBase()}/aboutDobermans`)
    }
}
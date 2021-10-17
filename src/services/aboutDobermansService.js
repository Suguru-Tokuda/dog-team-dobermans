import SessionInfoService from './sessionInfoService';
import axios from 'axios';

export default class AboutDobermanService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}aboutDobermans`;
    }

    static getAboutDobermans() {
        return axios.get(`${this.getServiceBase()}`);
    }
}
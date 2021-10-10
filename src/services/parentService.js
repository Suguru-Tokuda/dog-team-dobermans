import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class ParentService {

    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/parents`;
    }

    static getAllParents() {
        return axios.get(this.getServiceBase());
    }

    static getAllLiveParents() {
        return axios.get(`${this.getServiceBase()}?live=true`);
    }

    static getLiveParentsForLimit(limit) {
        return axios.get(`${this.getServiceBase()}?live=true&limit=${limit}`);
    }

    static getParent(parentID) {
        return axios.get(`${SessionInfoService.getBaseUrlForAPI()}/getByID?parentID=${parentID}`);
    }
}
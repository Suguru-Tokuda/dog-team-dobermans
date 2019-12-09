import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class ParentService {
    static getAllParents() {
        return axios.get(`${SessionInfoService.getBaseUrlForAPI()}parents?key=${api.API_KEY}`);
    }

    static getParent(parentID) {
        return axios.get(`${SessionInfoService.getBaseUrlForAPI()}parent?key=${api.API_KEY}&parentID=${parentID}`);
    }
}
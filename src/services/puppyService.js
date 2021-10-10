import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class PuppyService {

    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/puppies`
    }

    static getAllPuppies() {
        return axios.get(`${this.getServiceBase()}`)
    }

    static getAllLivePuppies() {
        return axios.get(`${this.getServiceBase()}?live=true`);
    }

    static getLivePuppiesForLimit(limit) {
        return axios.get(`${this.getServiceBase()}?live=true&limit=${limit}`);
    }

    static getPuppy(puppyID) {
        return axios.get(`${this.getServiceBase()}?puppyID=${puppyID}`);
    }
}
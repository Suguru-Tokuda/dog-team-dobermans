import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class PuppyService {

    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}`
    }

    static getAllPuppies() {
        return axios.get(`${this.getServiceBase()}puppies?key=${api.API_KEY}`)
    }

    static getAllLivePuppies() {
        return axios.get(`${this.getServiceBase()}puppies?key=${api.API_KEY}&live=true`);
    }

    static getLivePuppiesForLimit(limit) {
        return axios.get(`${this.getServiceBase()}puppies?key=${api.API_KEY}&live=true&limit=${limit}`);
    }

    static getPuppy(puppyID) {
        return axios.get(`${this.getServiceBase()}puppy?key=${api.API_KEY}&puppyID=${puppyID}`);
    }
}
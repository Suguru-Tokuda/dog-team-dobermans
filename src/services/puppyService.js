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

    static getPuppy(puppyID) {
        return axios.get(`${this.getServiceBase()}puppy?key=${api.API_KEY}&puppyID=${puppyID}`);
    }
}
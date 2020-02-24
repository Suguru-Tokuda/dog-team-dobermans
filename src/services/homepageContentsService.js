import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class HomepageContentsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}homepageContents?key=${api.API_KEY}`;
    }

    static getHomepageContents() {
        return axios.get(this.getServiceBase());
    }

    static getPuppyMessage() {
        return axios.get(`${SessionInfoService.getBaseUrlForAPI()}homepageContents/puppyMessage?key=${api.API_KEY}`);
    }
}
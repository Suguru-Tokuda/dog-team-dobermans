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
}
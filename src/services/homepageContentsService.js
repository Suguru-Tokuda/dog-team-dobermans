import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class HomepageContentsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/homepageContents`;
    }

    static getHomepageContents() {
        return axios.get(this.getServiceBase());
    }

    static getPuppyMessage() {
        return axios.get(`${SessionInfoService.getBaseUrlForAPI()}/puppyMessage`);
    }
}
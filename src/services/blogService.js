import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class BlogService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}blogs?key=${api.API_KEY}`;
    }

    static getAllBlogs() {
        return axios.get(`${this.getServiceBase}`);
    }
}
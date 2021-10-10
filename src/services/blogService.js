import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class BlogService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/blogs`;
    }

    static getAllBlogs() {
        return axios.get(`${this.getServiceBase()}`);
    }

    static getBlog(blogID) {
        return axios.get(`${this.getServiceBase()}&blogID=${blogID}`);
    }
}
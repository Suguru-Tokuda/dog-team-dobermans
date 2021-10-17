import SessionInfoService from './sessionInfoService';
import axios from 'axios';

export default class BlogService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/blogs`;
    }

    static getAllBlogs() {
        return axios.get(`${this.getServiceBase()}`);
    }

    static getBlog(blogID) {
        return axios.get(`${this.getServiceBase()}/getByID?blogID=${blogID}`);
    }
}
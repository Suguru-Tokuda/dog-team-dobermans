import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class WaitListService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}waitList`;
    }

    static createWaitRequest(data) {
        return axios.post(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }

    static sendWaitRequestMessage(senderID, waitRequestID, message) {
        const data = {
            waitRequestID: waitRequestID,
            senderID: senderID,
            message: message
        };

        return axios.post(`${this.getServiceBase()}waitList/message?apiKey=${api.API_KEY}`, data);
    }

    static getWaitRequestMessages(userID, waitRequestID) {
        return axios.get(`${this.getServiceBase()}waitList/Messages?apiKey=${api.API_KEY}&userID=${userID}&waitRequestID=${waitRequestID}`);
    }
}
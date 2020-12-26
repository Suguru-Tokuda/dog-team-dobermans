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

    static sendWaitRequestMessage(senderID, waitRequestID, messageBody) {
        const recipientID = 'sSJ0mWxDjtaTuFsolvKskzDY4GI3'; // bob's ID
    
        const data = {
            waitRequestID: waitRequestID,
            senderID: senderID,
            recipientID: recipientID,
            messageBody: messageBody,
            isBreeder: false,
            isRead: false
        };

        return axios.post(`${this.getServiceBase()}/messages?key=${api.API_KEY}`, data);
    }

    static editWaitRequestMessage(messageID, messageBody) {
        const data = {
            messageID: messageID,
            messageBody: messageBody
        };

        return axios.put(`${this.getServiceBase()}/messages?key=${api.API_KEY}`, data);
    }
    
    static getWaitRequestMessages(waitRequestID) {
        return axios.get(`${this.getServiceBase()}/messages?key=${api.API_KEY}&waitRequestID=${waitRequestID}`);
    }

    static getUnreadMessagesByUserID(userID) {
        return axios.get(`${this.getServiceBase()}/messages/getUnreadMessagesByUserID?key=${api.API_KEY}&userID=${userID}`)
    }

    static getWaitRequestList(userID, waitRequestID) {
        return axios.get(`${this.getServiceBase()}/getByUserID?key=${api.API_KEY}&userID=${userID}&waitRequestID=${waitRequestID}`);
    }

    static markMessageAsRead(messageIDs) {
        const data = {
            messageIDs: messageIDs
        };

        return axios.post(`${this.getServiceBase()}/messages/markAsRead?key=${api.API_KEY}`, data);
    }
}
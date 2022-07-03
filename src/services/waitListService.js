import SessionInfoService from './sessionInfoService';
import axios from 'axios';

export default class WaitlistService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/waitlist`;
    }

    static createWaitRequest(data) {
        return axios.post(`${this.getServiceBase()}/createByEmail`, data);
    }

    static getWaitRequestListByUserID(userID) {
        return axios.get(`${this.getServiceBase()}/getByUserID?userID=${userID}`);
    }

    static sendWaitRequestMessage(senderID, waitRequestID, messageBody) {
        const recipientID = 'sSJ0mWxDjtaTuFsolvKskzDY4GI3'; // bob's ID
    
        const data = {
            waitRequestID: waitRequestID,
            senderID: senderID,
            recipientID: recipientID,
            messageBody: messageBody,
            isBreeder: false,
            read: false
        };

        return axios.post(`${this.getServiceBase()}/messages`, data);
    }

    static editWaitRequestMessage(messageID, messageBody) {
        const data = {
            messageID: messageID,
            messageBody: messageBody
        };

        return axios.put(`${this.getServiceBase()}/messages`, data);
    }
    
    static getWaitRequestMessages(waitRequestID) {
        return axios.get(`${this.getServiceBase()}/messages?waitRequestID=${waitRequestID}`);
    }

    static getUnreadMessagesByUserID(userID) {
        return axios.get(`${this.getServiceBase()}/messages/unreadByUseID&userID=${userID}`)
    }

    static getWaitRequest(waitRequestID) {
        return axios.get(`${this.getServiceBase()}/getByID?waitRequestID=${waitRequestID}`);
    }

    static markMessageAsRead(messageIDs) {
        const data = {
            messageIDs: messageIDs
        };

        return axios.post(`${this.getServiceBase()}/messages/markAsRead`, data);
    }
}
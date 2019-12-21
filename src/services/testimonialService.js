import SessionInfoService from './sessionInfoService';
import UtilService from './utilService';
import * as api from '../api.json';
import axios from 'axios';
import { storage } from './firebaseService';

export default class TestimonialService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}testimonials`;
    }

    static getTestimonials() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}&approved=true`);
    }

    static createTestimonial(firstName, lastName, dogName, email, message, picture, date) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            dogName: dogName,
            email: email,
            message: message,
            picture: picture,
            created: date,
            approved: false
        };
        return axios.post(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }

    static uploadPicture(imageFile, dogName) {
        return new Promise((resolve) => {
            const pictureID = UtilService.generateID(10);
            const reference = `/testimonials/${dogName}-${pictureID}`;
            const task = storage.ref(reference).put(imageFile);
            task.on('state_changed',
                (snapshot) => {
                    switch (snapshot.state) {
                        case 'paused':
                            break;
                        case 'running':
                            break;
                        default:
                            break;
                    }
                },
                (err) => {
                    switch (err.code) {
                        case 'storage/unauthorized':
                            // console.log('unauthorized');
                            break;
                        case 'storage/canceled':
                            // console.log('canceled');
                            break;
                        case 'storage/unknown':
                            // console.log('unknown error');
                            break;
                        default:
                            break;
                    }
                },
                () => {
                    task.snapshot.ref.getDownloadURL()
                        .then((downloadURL) => {
                            resolve({
                                reference: reference,
                                url: downloadURL
                            });
                        });
                });
            });
    }
}
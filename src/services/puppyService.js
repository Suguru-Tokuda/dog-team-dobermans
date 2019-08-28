import SessionInfoService from './sessionInfoService';

export default class PuppyService {

    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}puppies`
    }

    static getAllPuppies() {

    }
}
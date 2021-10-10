export default class UtilService {
    // a function to access the value of the object for a corresponding nested key
    static accessValue(object: any, key: string) {
        const keys = key.split('.');
        let value = object;
        for (let i = 0, max = keys.length; i < max; i++) {
            value = value[keys[i]];
        }
        return value;
    }

    static generateID(length: number) {
        let retVal = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charLeng = characters.length;
        for (let i = 0, max = length; i < max; i++) {
            retVal += characters.charAt(Math.floor(Math.random() * charLeng));
        }
        return retVal;
    }

    static formatPhoneNumber(phone: string) {
        if (typeof phone !== 'undefined' && phone !== null) {
            const firstPart = phone.substring(0, 3);
            const secondPart = phone.substring(3, 6);
            const thirdPart = phone.substring(6, 10);
            return `${firstPart}-${secondPart}-${thirdPart}`;
        } else {
            return '';
        }
    }

    static shortenStr(str: string, len: number) {
        if (str === null || str === undefined || str.length === 0) {
            return '';
        }
        const strLength = str.length;
        let retVal = '';
        if (len <= strLength) {
            retVal = `${str.substring(0, len)}...`;
        } else {
            retVal = str;
        }
        return retVal;
    }

    static stripHTML(str: string) {
        let retVal = str;

        if (retVal) {
            retVal = retVal.replace(/(<([^>]+)>)/gi, '')
            retVal.replace(/&#?[a-z0-9]+;/g, ' ');
        }

        return retVal;
    }
}
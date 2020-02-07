export default class UtilService {
    // a function to access the value of the object for a corresponding nested key
    static accessValue(object, key) {
        const keys = key.split('.');
        let value = object;
        for (let i = 0, max = keys.length; i < max; i++) {
            value = value[keys[i]];
        }
        return value;
    }

    static generateID(length) {
        let retVal = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charLeng = characters.length;
        for (let i = 0, max = length; i < max; i++) {
            retVal += characters.charAt(Math.floor(Math.random() * charLeng));
        }
        return retVal;
    }

    static formatPhoneNumber(phone) {
        if (typeof phone !== 'undefined' && phone !== null) {
            const firstPart = phone.substring(0, 3);
            const secondPart = phone.substring(3, 6);
            const thirdPart = phone.substirng(6, 10);
            return `${firstPart}-${secondPart}-${thirdPart}`;
        } else {
            return '';
        }
    }
}
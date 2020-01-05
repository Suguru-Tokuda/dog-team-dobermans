export default class ValidationService {
    static validateEmail(email) {
        if (/^\w+([-]?\w+)*@\w+([-]?\w+)*(\w{2,3})+$/.test(email)) {
            return true;
        }
        return false;
    }
}
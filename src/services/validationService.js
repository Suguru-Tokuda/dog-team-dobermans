export default class ValidationService {

    static validateEmail(email) {
        const testRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (testRegex.test(email)) {
            return true;
        }
        return false;
    }

    static validatePhone(phone) {
        const testRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

        if (testRegex.test(phone)) {
            return true;
        }

        return false;
    }

    static validPassword(password, minLength) {
        const upperCaseRegex = /[A-Z]/g;
        const lowerCaseRegex = /[a-z]/g;
        const specialCharacterRegex = /[!@#?\]\-]/g;

        return password.length >= minLength && upperCaseRegex.test(password) && lowerCaseRegex.test(password) && specialCharacterRegex.test(password)
    }
}
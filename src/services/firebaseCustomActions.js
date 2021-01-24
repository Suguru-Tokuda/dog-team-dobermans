export default class classFirebaseCustomActions {
    static getCustomActionParameters() {
        const baseURL = window.location.origin.toString();

        return {
            url: `${baseURL}/user-registration`
        }
    }
}
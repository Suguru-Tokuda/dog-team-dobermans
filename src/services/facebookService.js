export default class FacebookService {
    
    static getLoginStatus() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }
}
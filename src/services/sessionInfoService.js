export default class SessionInfoService {
    static getBaseUrlForAPI() {
        const prodOrigins = [
            "https://dogteamdobermans.com",
            "https://dogteamdobermans.web.app",
            "https://dogteamdobermans.firebaseapp.com"
        ];
        const isProd = prodOrigins.indexOf(window.location.origin) !== -1;

        if (isProd)
            return "https://us-central1-dogteamdobermans.cloudfunctions.net/";
        else
            return "https://us-central1-dogteamdobermansdev.cloudfunctions.net/";
    }
}
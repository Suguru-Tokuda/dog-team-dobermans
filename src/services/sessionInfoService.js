export default class SessionInfoService {
    static getBaseUrlForAPI() {
        const isProd = window.location.toString().indexOf('https://dogteamdobermans.com/') !== -1;

        if (isProd)
            return "https://us-central1-dogteamdobermans.cloudfunctions.net/";
        else
            return "https://us-central1-dogteamdobermansdev.cloudfunctions.net/";
    }
}
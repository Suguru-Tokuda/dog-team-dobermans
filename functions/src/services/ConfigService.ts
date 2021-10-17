import * as config from "../config.json";

export default class ConfigService {
    static isProd = true;

    static getConfig() {
        const parsedJSON = JSON.parse(JSON.stringify(config));
        return parsedJSON;
    }

    static getPublicBaseURL() {
        const configJson = this.getConfig();
    
        if (this.isProd) {
            return configJson.baseURL.prod.public;
        } else {
            return configJson.baseURL.dev.public;
        }
    }
        
    static getAdminBaseURL() {
        const configJson = this.getConfig();
    
        if (this.isProd) {
            return configJson.baseURL.prod.admin;
        } else {
            return configJson.baseURL.dev.admin;
        }
    }
    
    static getBreederEmail() {
        const configJSON = this.getConfig();
    
        if (this.isProd) {
            return configJSON.breederEmail.prod;
        } else {
            return configJSON.breederEmail.dev;
        }
    }
    
    static getBreederID() {
        const configJSON = this.getConfig();
    
        return configJSON.breederID;
    }

}
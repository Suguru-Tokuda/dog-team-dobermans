import * as cors from 'cors';

const whitelist = ['http://us-central1-dogteamdobermansdev.cloudfunctions.net', 'http://localhost:3000'];
const corsOptions = {
    origin: (origin: any, callback: any) => {
        if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
        } else {
        callback(new Error('Not allowed by CORS'))
        }
    }
}

const corsInstance = cors(corsOptions);

export default corsInstance;